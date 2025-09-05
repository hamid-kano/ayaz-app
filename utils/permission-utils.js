import AppConfig from "./app-config";

/**
 * أدوات إدارة الأذونات - الإشعارات والتسجيل الصوتي
 */
export default class PermissionUtils {
  
  /**
   * التحقق من إذن التسجيل الصوتي (عبر WebView)
   */
  static async handleAudioPermission() {
    // التسجيل يتم عبر Web Audio API في WebView
    console.log('🎤 Audio recording handled by WebView');
    return true;
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
      case 'AUDIO':
        title = messages.AUDIO_TITLE;
        message = messages.AUDIO_MESSAGE;
        break;
      default:
        title = 'إذن مطلوب';
        message = 'يحتاج التطبيق إلى هذا الإذن للعمل بشكل صحيح';
    }

    console.log(`⚠️ Permission denied: ${title} - ${message}`);
  }

  /**
   * التحقق من جميع الأذونات المطلوبة
   * @returns {Promise<Object>} حالة جميع الأذونات
   */
  static async checkAllPermissions() {
    try {
      console.log('🔍 Checking permissions (notifications only)...');
      
      const permissions = {
        notifications: true, // الإشعارات تتم إدارتها في NotificationService
        audio: false
      };

      // التسجيل الصوتي يتم عبر WebView
      permissions.audio = true;

      console.log('📊 Permissions status:', permissions);
      return permissions;
    } catch (error) {
      console.error('💥 Error checking permissions:', error);
      return {
        notifications: false,
        audio: false
      };
    }
  }

  /**
   * طلب الأذونات المطلوبة (الإشعارات والتسجيل الصوتي)
   * @returns {Promise<boolean>} نجح في الحصول على الأذونات
   */
  static async requestPermissions() {
    try {
      console.log('📱 Requesting permissions...');
      
      // طلب إذن التسجيل الصوتي
      const audioGranted = await this.handleAudioPermission();
      
      console.log('📊 Permission request results:', {
        audio: audioGranted
      });

      return audioGranted;
    } catch (error) {
      console.error('💥 Error requesting permissions:', error);
      return false;
    }
  }
}