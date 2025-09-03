import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

/**
 * خدمات الوسائط والملفات
 */
export default class MediaService {

  /**
   * اختيار صورة من المعرض
   */
  static async pickImageFromGallery() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('خطأ', 'نحتاج إذن الوصول للمعرض');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true
      });

      if (!result.canceled) {
        return {
          uri: result.assets[0].uri,
          base64: result.assets[0].base64,
          type: 'image',
          name: `image_${Date.now()}.jpg`
        };
      }
      return null;
    } catch (error) {
      console.error('خطأ في اختيار الصورة:', error);
      return null;
    }
  }

  /**
   * التقاط صورة بالكاميرا
   */
  static async takePhoto() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('خطأ', 'نحتاج إذن الكاميرا');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true
      });

      if (!result.canceled) {
        return {
          uri: result.assets[0].uri,
          base64: result.assets[0].base64,
          type: 'image',
          name: `photo_${Date.now()}.jpg`
        };
      }
      return null;
    } catch (error) {
      console.error('خطأ في التقاط الصورة:', error);
      return null;
    }
  }

  /**
   * اختيار ملف من النظام
   */
  static async pickDocument() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/*'],
        copyToCacheDirectory: true,
        multiple: false
      });

      if (!result.canceled) {
        const file = result.assets[0];
        
        // قراءة الملف كـ base64
        const base64 = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        return {
          uri: file.uri,
          name: file.name,
          size: file.size,
          type: file.mimeType || 'application/octet-stream',
          base64: base64
        };
      }
      return null;
    } catch (error) {
      console.error('خطأ في اختيار الملف:', error);
      return null;
    }
  }

  /**
   * بدء التسجيل الصوتي
   */
  static async startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('خطأ', 'نحتاج إذن الميكروفون');
        return null;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      
      return recording;
    } catch (error) {
      console.error('خطأ في بدء التسجيل:', error);
      return null;
    }
  }

  /**
   * إيقاف التسجيل الصوتي
   */
  static async stopRecording(recording) {
    try {
      if (!recording) return null;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        // قراءة الملف الصوتي كـ base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        return {
          uri: uri,
          base64: base64,
          type: 'audio',
          name: `recording_${Date.now()}.m4a`
        };
      }
      return null;
    } catch (error) {
      console.error('خطأ في إيقاف التسجيل:', error);
      return null;
    }
  }

  /**
   * تشغيل ملف صوتي
   */
  static async playAudio(uri) {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
      return sound;
    } catch (error) {
      console.error('خطأ في تشغيل الصوت:', error);
      return null;
    }
  }

  /**
   * التحقق من نوع الملف
   */
  static isValidFileType(mimeType, allowedTypes = ['image/*', 'application/pdf']) {
    return allowedTypes.some(type => {
      if (type.endsWith('*')) {
        return mimeType.startsWith(type.slice(0, -1));
      }
      return mimeType === type;
    });
  }

  /**
   * التحقق من حجم الملف
   */
  static isValidFileSize(size, maxSize = 50 * 1024 * 1024) { // 50MB
    return size <= maxSize;
  }

  /**
   * ضغط الصورة
   */
  static async compressImage(uri, quality = 0.7) {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: quality,
        base64: true
      });

      if (!result.canceled) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('خطأ في ضغط الصورة:', error);
      return null;
    }
  }
}