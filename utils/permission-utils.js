import AppConfig from "./app-config";

/**
 * أدوات إدارة الأذونات - الإشعارات فقط
 */
export default class PermissionUtils {
  
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
        notifications: true // الإشعارات تتم إدارتها في NotificationService
      };

      console.log('📊 Permissions status:', permissions);
      return permissions;
    } catch (error) {
      console.error('💥 Error checking permissions:', error);
      return {
        notifications: false
      };
    }
  }

  /**
   * طلب الأذونات المطلوبة (الإشعارات فقط)
   * @returns {Promise<boolean>} نجح في الحصول على الأذونات
   */
  static async requestPermissions() {
    try {
      console.log('📱 Requesting permissions (notifications only)...');
      
      // الإشعارات تتم إدارتها في NotificationService
      console.log('📊 Permission request completed');
      return true;
    } catch (error) {
      console.error('💥 Error requesting permissions:', error);
      return false;
    }
  }
}