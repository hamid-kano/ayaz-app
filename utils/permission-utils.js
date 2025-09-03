import * as Location from "expo-location";
import { Alert, Platform, Linking } from "react-native";
import AppConfig from "./app-config";

/**
 * أدوات إدارة الأذونات المحسنة
 */
export default class PermissionUtils {
  
  /**
   * التحقق من إذن الموقع وطلبه إذا لزم الأمر
   * @returns {Promise<boolean>} حالة الإذن
   */
  static async handleLocationPermission() {
    try {
      console.log('📍 Starting location permission check...');
      
      // التحقق من حالة الإذن الحالية
      const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
      console.log('📍 Current permission status:', currentStatus);

      // إذا كان الإذن ممنوحًا بالفعل، نتحقق من حالة GPS فقط
      if (currentStatus === "granted") {
        console.log('✅ Location permission already granted');
        return await this.checkGPSService();
      }

      // إذا كان الإذن مرفوضًا نهائياً
      if (currentStatus === "denied") {
        console.log('❌ Location permission permanently denied');
        this.showPermissionDeniedAlert('LOCATION');
        return false;
      }

      // طلب إذن الموقع
      console.log('📱 Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('📍 Permission request result:', status);

      if (status !== "granted") {
        console.log('❌ Location permission denied');
        this.showPermissionDeniedAlert('LOCATION');
        return false;
      }

      console.log('✅ Location permission granted');
      // بعد منح الإذن، نتحقق من حالة GPS
      return await this.checkGPSService();
      
    } catch (error) {
      console.error('💥 Error requesting location permission:', error);
      return false;
    }
  }

  /**
   * التحقق من خدمة GPS وتفعيلها
   * @returns {Promise<boolean>} حالة الخدمة
   */
  static async checkGPSService() {
    try {
      console.log('🛰️ Checking GPS service...');
      
      const serviceEnabled = await Location.hasServicesEnabledAsync();
      console.log('🛰️ GPS service status:', serviceEnabled);
      
      if (!serviceEnabled) {
        console.log('⚠️ GPS service not enabled');
        
        if (Platform.OS === "android") {
          try {
            console.log('🔄 Attempting to enable GPS service...');
            await Location.enableNetworkProviderAsync();
            console.log('✅ GPS service enabled');
            return true;
          } catch (enableError) {
            console.error('❌ Failed to enable GPS automatically:', enableError);
            this.showGPSDisabledAlert();
            return false;
          }
        } else {
          // في iOS لا يمكن تفعيل GPS برمجيًا
          this.showGPSDisabledAlert();
          return false;
        }
      }

      console.log('✅ GPS service enabled');
      return true;
    } catch (error) {
      console.error('💥 Error checking GPS service:', error);
      return false;
    }
  }

  /**
   * الحصول على الموقع الحالي مع معالجة الأخطاء
   * @returns {Promise<Object|null>} بيانات الموقع
   */
  static async getCurrentLocation() {
    try {
      console.log('📍 Getting current location...');
      
      // التحقق من الأذونات أولاً
      const hasPermission = await this.handleLocationPermission();
      if (!hasPermission) {
        console.log('❌ No location permission');
        return null;
      }

      // الحصول على الموقع مع خيارات محسنة
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
        maximumAge: 10000
      });

      console.log('📍 Location obtained:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy
      });

      return location;
    } catch (error) {
      console.error('💥 Error getting location:', error);
      
      // معالجة أنواع مختلفة من الأخطاء
      if (error.code === 'E_LOCATION_TIMEOUT') {
        console.log('⏰ Location request timeout');
      } else if (error.code === 'E_LOCATION_UNAVAILABLE') {
        console.log('📍 Location unavailable');
      }
      
      return null;
    }
  }

  /**
   * مراقبة تغييرات الموقع
   * @param {Function} callback دالة الاستدعاء عند تغيير الموقع
   * @returns {Promise<Object|null>} مرجع المراقب
   */
  static async watchLocation(callback) {
    try {
      console.log('👀 Starting location monitoring...');
      
      const hasPermission = await this.handleLocationPermission();
      if (!hasPermission) {
        return null;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // كل 10 ثوانٍ
          distanceInterval: 100 // كل 100 متر
        },
        (location) => {
          console.log('📍 Location update:', location.coords);
          if (callback) {
            callback(location);
          }
        }
      );

      console.log('✅ Location monitoring started');
      return subscription;
    } catch (error) {
      console.error('💥 Error monitoring location:', error);
      return null;
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
      case 'LOCATION':
        title = messages.LOCATION_TITLE;
        message = messages.LOCATION_MESSAGE;
        break;
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
   * عرض تنبيه GPS معطل
   */
  static showGPSDisabledAlert() {
    const messages = AppConfig.PERMISSION_MESSAGES;
    
    Alert.alert(
      messages.GPS_TITLE,
      messages.GPS_MESSAGE,
      [
        {
          text: messages.OPEN_SETTINGS,
          onPress: () => {
            console.log('🔧 Opening GPS settings...');
            if (Platform.OS === 'android') {
              // في Android يمكن فتح إعدادات الموقع مباشرة
              Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
            } else {
              Linking.openSettings();
            }
          }
        },
        {
          text: messages.CANCEL,
          style: "cancel",
          onPress: () => console.log('❌ GPS settings opening cancelled')
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
        location: false,
        locationService: false
      };

      // التحقق من إذن الموقع
      const { status: locationStatus } = await Location.getForegroundPermissionsAsync();
      permissions.location = locationStatus === 'granted';

      // التحقق من خدمة الموقع
      if (permissions.location) {
        permissions.locationService = await Location.hasServicesEnabledAsync();
      }

      console.log('📊 Permissions status:', permissions);
      return permissions;
    } catch (error) {
      console.error('💥 Error checking permissions:', error);
      return {
        location: false,
        locationService: false
      };
    }
  }

  /**
   * طلب جميع الأذونات المطلوبة
   * @returns {Promise<boolean>} نجح في الحصول على جميع الأذونات
   */
  static async requestAllPermissions() {
    try {
      console.log('📱 Requesting all permissions...');
      
      // طلب إذن الموقع
      const locationGranted = await this.handleLocationPermission();
      
      console.log('📊 Permission request results:', {
        location: locationGranted
      });

      return locationGranted;
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