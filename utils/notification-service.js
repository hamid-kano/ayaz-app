import { OneSignal } from "react-native-onesignal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppConfig from "./app-config";

/**
 * خدمة إدارة الإشعارات المحسنة
 */
export default class NotificationService {
  /**
   * تهيئة خدمة الإشعارات
   * @param {Function} onNotificationOpened دالة تنفذ عند فتح الإشعار
   * @param {Function} onNotificationReceived دالة تنفذ عند استلام الإشعار
   * @returns {Promise<string|null>} معرف اللاعب
   */
  static async initializeNotifications(
    onNotificationOpened,
    onNotificationReceived
  ) {
    try {
      console.log("🔔 Starting notification service initialization...");

      // Initialize OneSignal
      OneSignal.initialize(AppConfig.ONE_SIGNAL_APP_ID);
      OneSignal.Debug.setLogLevel(6);

      // Request notification permission
      const hasPermission = await OneSignal.Notifications.requestPermission(
        true
      );
      console.log("📱 Notification permission:", hasPermission);

      // Set notification handlers
      OneSignal.Notifications.addEventListener(
        "foregroundWillDisplay",
        (event) => {
          const notification = event.notification;
          const title = notification?.title || "";
          const body = notification?.body || "";
          console.log("🔔 Received foreground notification:", { title, body });

          // عرض الإشعار
          event.notification.display();

          if (onNotificationReceived) {
            onNotificationReceived(notification);
          }
        }
      );

      OneSignal.Notifications.addEventListener("click", (event) => {
        const notification = event.notification;
        const title = notification?.title || "";
        const body = notification?.body || "";
        console.log("👆 Notification clicked:", { title, body });
        if (onNotificationOpened) {
          onNotificationOpened(event);
        }
      });

      // Get Subscription ID (Player ID)
      let playerId = null;
      let attempts = 0;
      const maxAttempts = 5;

      while (!playerId && attempts < maxAttempts) {
        try {
          playerId = await OneSignal.User.pushSubscription.getIdAsync();

          if (playerId) {
            console.log("🎯 Player ID obtained:", playerId);
            await AsyncStorage.setItem("@player_id", playerId);
            await AsyncStorage.setItem(
              "@player_id_timestamp",
              Date.now().toString()
            );
            break;
          } else {
            attempts++;
            console.log(
              `⏳ Attempt ${attempts}/${maxAttempts} to get player ID...`
            );
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        } catch (error) {
          attempts++;
          console.error(`❌ Error in attempt ${attempts}:`, error);
          if (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }

      return playerId;
    } catch (error) {
      console.error("💥 Error initializing notifications:", error);
      return null;
    }
  }

  /**
   * الحصول على معرف اللاعب مع التحقق من الصحة
   * @returns {Promise<string|null>} معرف اللاعب
   */
  static async getDeviceToken() {
    try {
      const savedPlayerId = await AsyncStorage.getItem("@player_id");
      const timestamp = await AsyncStorage.getItem("@player_id_timestamp");

      if (savedPlayerId && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        const maxAge = 24 * 60 * 60 * 1000;

        if (age < maxAge) {
          return savedPlayerId;
        }
      }

      const playerId = await OneSignal.User.pushSubscription.getIdAsync();

      if (playerId) {
        await AsyncStorage.setItem("@player_id", playerId);
        await AsyncStorage.setItem(
          "@player_id_timestamp",
          Date.now().toString()
        );
      }

      return playerId;
    } catch (error) {
      console.error("❌ Error getting player ID:", error);
      return null;
    }
  }

  /**
   * تسجيل المستخدم مع معالجة الأخطاء
   * @param {string} userId معرف المستخدم
   */
  static async setExternalUserId(userId) {
    try {
      if (!userId || typeof userId !== "string") {
        throw new Error("Invalid user ID");
      }

      OneSignal.login(userId);
      await AsyncStorage.setItem("@external_user_id", userId);
      console.log("👤 External user ID set:", userId);
    } catch (error) {
      console.error("❌ Error setting external user ID:", error);
    }
  }

  /**
   * إلغاء تسجيل المستخدم
   */
  static async removeExternalUserId() {
    try {
      OneSignal.logout();
      await AsyncStorage.removeItem("@external_user_id");
      console.log("🗑️ External user ID removed");
    } catch (error) {
      console.error("❌ Error removing external user ID:", error);
    }
  }

  /**
   * إضافة علامات للمستخدم مع التحقق
   * @param {Object} tags العلامات
   */
  static async addTags(tags) {
    try {
      if (!tags || typeof tags !== "object") {
        throw new Error("Invalid tags");
      }

      const cleanTags = {};
      Object.keys(tags).forEach((key) => {
        if (tags[key] !== null && tags[key] !== undefined) {
          cleanTags[key] = String(tags[key]);
        }
      });

      if (Object.keys(cleanTags).length > 0) {
        OneSignal.User.addTags(cleanTags);
        console.log("🏷️ Tags added:", cleanTags);
      }
    } catch (error) {
      console.error("❌ Error adding tags:", error);
    }
  }

  /**
   * حذف علامات المستخدم
   * @param {Array<string>} keys مفاتيح العلامات
   */
  static async removeTags(keys) {
    try {
      if (!Array.isArray(keys) || keys.length === 0) {
        throw new Error("Invalid tag keys");
      }

      OneSignal.User.removeTags(keys);
      console.log("🗑️ Tags deleted:", keys);
    } catch (error) {
      console.error("❌ Error deleting tags:", error);
    }
  }

  /**
   * التحقق من حالة الإذن
   * @returns {Promise<boolean>} حالة الإذن
   */
  static async isNotificationsEnabled() {
    try {
      const isEnabled = await OneSignal.Notifications.getPermissionAsync();
      console.log("🔔 Notification permission status:", isEnabled);
      return isEnabled;
    } catch (error) {
      console.error("❌ Error checking permission status:", error);
      return false;
    }
  }

  /**
   * إرسال إشعار محلي (للاختبار)
   * @param {string} title العنوان
   * @param {string} message الرسالة
   */
  static async sendLocalNotification(title, message) {
    try {
      console.log("📱 Local notification:", { title, message });
    } catch (error) {
      console.error("❌ Error sending local notification:", error);
    }
  }

  /**
   * تنظيف البيانات المحفوظة
   */
  static async clearStoredData() {
    try {
      await AsyncStorage.multiRemove([
        "@player_id",
        "@player_id_timestamp",
        "@external_user_id",
      ]);
      console.log("🧹 Notification stored data cleared");
    } catch (error) {
      console.error("❌ Error clearing data:", error);
    }
  }
}
