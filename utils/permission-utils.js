import { Alert, Platform, Linking } from "react-native";
import * as MediaLibrary from "expo-media-library";
import AppConfig from "./app-config";

/**
 * أدوات إدارة الأذونات المحسنة (بدون الموقع الجغرافي)
 */
export default class PermissionUtils {
  
  /**
   * التحقق من إذن الوسائط وطلبه إذا لزم الأمر
   * @returns {Promise<boolean>} حالة الإذن
   */
  static async handleMediaPermission() {
    try {
      console.log('📷 Starting media permission check...');
      
      // التحقق من حالة الإذن الحالية
      const { status: currentStatus } = await MediaLibrary.getPermissionsAsync();
      console.log('📷 Current media permission status:', currentStatus);

      // إذا كان الإذن ممنوحًا بالفعل
      if (currentStatus === "granted") {
        console.log('✅ Media permission already granted');
        return true;
      }

      // إذا كان الإذن مرفوضًا نهائياً
      if (currentStatus === "denied") {
        console.log('❌ Media permission permanently denied');
        this.showPermissionDeniedAlert('MEDIA');
        return false;
      }

      // طلب إذن الوسائط
      console.log('📱 Requesting media permission...');
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log('📷 Media permission request result:', status);

      if (status !== "granted") {
        console.log('❌ Media permission denied');
        this.showPermissionDeniedAlert('MEDIA');
        return false;
      }

      console.log('✅ Media permission granted');
      return true;
      
    } catch (error) {
      console.error('💥 Error requesting media permission:', error);
      return false;
    }
  }

  /**
   * عرض تنبيه رفض الإذن
   * @param {string} permissionType نوع الإذن
   */
  static showPermissionDeniedAlert(permissionType) {
    const messages = AppConfig.PERMISSION_MESSAGES;
    let title, message;

    switch (permissionType) {
      case 'NOTIFICATION':
        title = messages.NOTIFICATION_TITLE;
        message = messages.NOTIFICATION_MESSAGE;
        break;
      case 'CAMERA':
        title = messages.CAMERA_TITLE;
        message = messages.CAMERA_MESSAGE;
        break;
      case 'MEDIA':
        title = messages.MEDIA_TITLE;
        message = messages.MEDIA_MESSAGE;
        break;
      default:
        title = 'إذن مطلوب';
        message = 'يحتاج التطبيق إلى هذا الإذن للعمل بشكل صحيح';
    }

    Alert.alert(
      title,
      message,
      [
        {
          text: messages.OPEN_SETTINGS,
          onPress: () => {
            console.log('🔧 Opening settings...');
            Linking.openSettings();
          }
        },
        {
          text: messages.CANCEL,
          style: "cancel",
          onPress: () => console.log('❌ Settings opening cancelled')
        }
      ],
      { cancelable: true }
    );
  }

  /**
   * التحقق من جميع الأذونات المطلوبة
   * @returns {Promise<Object>} حالة جميع الأذونات
   */
  static async checkAllPermissions() {
    try {
      console.log('🔍 Checking all permissions...');
      
      const permissions = {
        media: false
      };

      // التحقق من إذن الوسائط
      const { status: mediaStatus } = await MediaLibrary.getPermissionsAsync();
      permissions.media = mediaStatus === 'granted';

      console.log('📊 Permissions status:', permissions);
      return permissions;
    } catch (error) {
      console.error('💥 Error checking permissions:', error);
      return {
        media: false
      };
    }
  }

  /**
   * طلب أذونات الوسائط فقط
   * @returns {Promise<boolean>} نجح في الحصول على الأذونات
   */
  static async requestMediaPermissions() {
    try {
      console.log('📱 Requesting media permissions...');
      
      // طلب إذن الوسائط
      const mediaGranted = await this.handleMediaPermission();
      
      console.log('📊 Permission request results:', {
        media: mediaGranted
      });

      return mediaGranted;
    } catch (error) {
      console.error('💥 Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * إعادة تعيين حالة الأذونات (للاختبار)
   */
  static async resetPermissions() {
    try {
      console.log('🔄 Resetting permissions...');
      // هذه الوظيفة للاختبار فقط
      // في التطبيق الحقيقي، يجب على المستخدم إعادة تعيين الأذونات من الإعدادات
      console.log('ℹ️ Permissions must be reset from system settings');
    } catch (error) {
      console.error('💥 Error resetting permissions:', error);
    }
  }
}