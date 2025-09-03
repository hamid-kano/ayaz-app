/**
 * إعدادات التطبيق الأساسية
 */
export const AppConfig = {
  // معلومات التطبيق
  APP_NAME: 'مطبعة اياز',
  APP_VERSION: 'v1.0.0',
  
  // الروابط
  BASE_URL: 'https://ayaz-printing.com/',
  PLAY_STORE_LINK: 'https://play.google.com/store/apps/details?id=com.ayaz.printing',
  APP_STORE_LINK: 'https://apps.apple.com/app/ayaz-printing/id123456789',
  
  // OneSignal
  ONE_SIGNAL_APP_ID: 'YOUR_ONESIGNAL_APP_ID',
  
  // الألوان
  COLORS: {
    PRIMARY: '#1e88e5',
    SECONDARY: '#0d47a1',
    WHITE: '#ffffff',
    ERROR: '#e74c3c',
    SUCCESS: '#27ae60',
    WARNING: '#f39c12',
    INFO: '#3498db',
    BACKGROUND: '#f8f9fa',
    TEXT_PRIMARY: '#2c3e50',
    TEXT_SECONDARY: '#7f8c8d'
  },
  
  // إعدادات WebView المحسنة
  WEBVIEW_SETTINGS: {
    domStorageEnabled: true,
    javaScriptEnabled: true,
    allowFileAccess: true,
    allowUniversalAccessFromFileURLs: true,
    mixedContentMode: 'always', // String is correct for this property
    overScrollMode: 'never', // String is correct for this property
    geolocationEnabled: true,
    mediaPlaybackRequiresUserGesture: false,
    allowsInlineMediaPlayback: true,
    cacheEnabled: true,
    incognito: false,
    bounces: false,
    scalesPageToFit: true,
    textSelectable: false,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    decelerationRate: 0.998, // 'normal' equivalent as numeric value
    automaticallyAdjustContentInsets: false,
    contentInset: { top: 0, left: 0, bottom: 0, right: 0 },
    scrollEnabled: true,
    nestedScrollEnabled: true,
    thirdPartyCookiesEnabled: true,
    sharedCookiesEnabled: true,
    pullToRefreshEnabled: true
  },
  
  // رسائل الأخطاء المحسنة
  ERROR_MESSAGES: {
    NO_INTERNET: 'لا يوجد اتصال بالإنترنت',
    NO_INTERNET_DESC: 'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.',
    SSL_ERROR: 'خطأ في الاتصال الآمن',
    SSL_ERROR_DESC: 'هناك مشكلة في شهادة الأمان للموقع.',
    PAGE_NOT_AVAILABLE: 'الصفحة غير متاحة',
    PAGE_NOT_AVAILABLE_DESC: 'تعذر الوصول إلى الصفحة المطلوبة. قد تكون الصفحة غير موجودة أو الخادم غير متاح حالياً.',
    NETWORK_CHANGED: 'تم تغيير الشبكة',
    NETWORK_CHANGED_DESC: 'تم تغيير اتصال الشبكة. جاري إعادة الاتصال...',
    CONNECTION_CLOSED: 'تم إغلاق الاتصال',
    CONNECTION_CLOSED_DESC: 'تم إغلاق الاتصال بشكل غير متوقع. يرجى إعادة المحاولة.',
    TIMEOUT: 'انتهت مهلة الاتصال',
    TIMEOUT_DESC: 'استغرق الاتصال وقتاً طويلاً. يرجى التحقق من سرعة الإنترنت والمحاولة مرة أخرى.',
    TOO_MANY_REDIRECTS: 'إعادة توجيه مفرطة',
    TOO_MANY_REDIRECTS_DESC: 'حدثت مشكلة في الوصول إلى الموقع بسبب كثرة إعادة التوجيه.',
    FILE_ERROR: 'خطأ في الملف',
    FILE_ERROR_DESC: 'تعذر تحميل الملف المطلوب.',
    GENERAL_ERROR: 'حدث خطأ',
    GENERAL_ERROR_DESC: 'حدث خطأ غير متوقع. يرجى إعادة المحاولة.',
    UPDATE_AVAILABLE: 'تحديث متاح',
    UPDATE_AVAILABLE_DESC: 'يتوفر تحديث جديد للتطبيق. يرجى التحديث للحصول على أحدث الميزات.'
  },
  
  // رسائل الأذونات
  PERMISSION_MESSAGES: {
    LOCATION_TITLE: 'إذن الموقع',
    LOCATION_MESSAGE: 'يرجى تفعيل إذن الموقع من إعدادات التطبيق.',
    GPS_TITLE: 'خدمة الموقع',
    GPS_MESSAGE: 'يرجى تفعيل GPS من إعدادات الهاتف.',
    NOTIFICATION_TITLE: 'الإشعارات',
    NOTIFICATION_MESSAGE: 'يرجى تفعيل الإشعارات من الإعدادات.',
    CAMERA_TITLE: 'إذن الكاميرا',
    CAMERA_MESSAGE: 'يرجى تفعيل إذن الكاميرا من إعدادات التطبيق.',
    MEDIA_TITLE: 'إذن الوسائط',
    MEDIA_MESSAGE: 'يرجى تفعيل إذن الوسائط من إعدادات التطبيق.',
    OPEN_SETTINGS: 'فتح الإعدادات',
    CANCEL: 'إلغاء'
  },
  
  // رسائل التأكيد
  CONFIRMATION_MESSAGES: {
    EXIT_TITLE: 'تأكيد الخروج',
    EXIT_MESSAGE: 'هل تريد الخروج من التطبيق؟',
    EXIT: 'خروج',
    CANCEL: 'إلغاء',
    REFRESH_TITLE: 'إعادة تحميل',
    REFRESH_MESSAGE: 'هل تريد إعادة تحميل الصفحة؟',
    REFRESH: 'إعادة تحميل'
  },
  
  // إعدادات الأداء
  PERFORMANCE: {
    CACHE_SIZE: 100 * 1024 * 1024, // 100MB
    MAX_MEMORY_USAGE: 512 * 1024 * 1024, // 512MB
    NETWORK_TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 2000 // 2 seconds
  }
};

export default AppConfig;