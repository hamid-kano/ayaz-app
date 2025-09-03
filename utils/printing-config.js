/**
 * إعدادات خاصة بمطبعة اياز
 */
export const PrintingConfig = {
  // خدمات الطباعة
  SERVICES: {
    BUSINESS_CARDS: {
      id: 'business_cards',
      name: 'بطاقات أعمال',
      description: 'بطاقات أعمال احترافية بجودة عالية',
      minQuantity: 100,
      maxQuantity: 10000,
      formats: ['pdf', 'ai', 'psd', 'jpg', 'png'],
      sizes: ['9x5 سم', '8.5x5.5 سم', 'مخصص']
    },
    BROCHURES: {
      id: 'brochures',
      name: 'بروشورات',
      description: 'بروشورات تسويقية وإعلانية',
      minQuantity: 50,
      maxQuantity: 5000,
      formats: ['pdf', 'ai', 'psd', 'jpg'],
      sizes: ['A4', 'A5', 'A6', 'مخصص']
    },
    BANNERS: {
      id: 'banners',
      name: 'لافتات',
      description: 'لافتات إعلانية للمحلات والفعاليات',
      minQuantity: 1,
      maxQuantity: 100,
      formats: ['pdf', 'ai', 'psd', 'jpg', 'png'],
      sizes: ['1x2 متر', '2x3 متر', '3x4 متر', 'مخصص']
    },
    STICKERS: {
      id: 'stickers',
      name: 'ملصقات',
      description: 'ملصقات بأشكال وأحجام مختلفة',
      minQuantity: 50,
      maxQuantity: 10000,
      formats: ['pdf', 'ai', 'eps', 'jpg', 'png'],
      sizes: ['دائري', 'مربع', 'مستطيل', 'مخصص']
    },
    FLYERS: {
      id: 'flyers',
      name: 'فلايرز',
      description: 'فلايرز دعائية وإعلانية',
      minQuantity: 100,
      maxQuantity: 10000,
      formats: ['pdf', 'ai', 'psd', 'jpg'],
      sizes: ['A4', 'A5', 'A6', 'مخصص']
    },
    POSTERS: {
      id: 'posters',
      name: 'بوسترات',
      description: 'بوسترات بأحجام كبيرة',
      minQuantity: 1,
      maxQuantity: 500,
      formats: ['pdf', 'ai', 'psd', 'jpg', 'png'],
      sizes: ['A3', 'A2', 'A1', 'A0', 'مخصص']
    }
  },

  // أنواع الملفات المدعومة
  SUPPORTED_FILES: {
    FORMATS: ['pdf', 'jpg', 'jpeg', 'png', 'ai', 'psd', 'eps', 'svg'],
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    COMPRESSION_QUALITY: 0.8,
    PREVIEW_FORMATS: ['jpg', 'jpeg', 'png', 'pdf']
  },

  // إعدادات الطلبات
  ORDER_SETTINGS: {
    MIN_ORDER_VALUE: 10, // 10 ريال
    RUSH_ORDER_MULTIPLIER: 1.5, // زيادة 50% للطلبات العاجلة
    STANDARD_DELIVERY_DAYS: 3,
    RUSH_DELIVERY_HOURS: 24,
    FREE_DELIVERY_THRESHOLD: 200, // توصيل مجاني فوق 200 ريال
    DELIVERY_COST: 15 // تكلفة التوصيل 15 ريال
  },

  // أنواع الورق
  PAPER_TYPES: {
    STANDARD: {
      id: 'standard',
      name: 'ورق عادي',
      weight: '80 جرام',
      price_multiplier: 1.0
    },
    PREMIUM: {
      id: 'premium',
      name: 'ورق فاخر',
      weight: '120 جرام',
      price_multiplier: 1.3
    },
    GLOSSY: {
      id: 'glossy',
      name: 'ورق لامع',
      weight: '150 جرام',
      price_multiplier: 1.5
    },
    MATTE: {
      id: 'matte',
      name: 'ورق مطفي',
      weight: '150 جرام',
      price_multiplier: 1.4
    }
  },

  // خيارات الطباعة
  PRINT_OPTIONS: {
    COLORS: {
      BW: { id: 'bw', name: 'أبيض وأسود', multiplier: 1.0 },
      COLOR: { id: 'color', name: 'ملون', multiplier: 1.8 }
    },
    SIDES: {
      SINGLE: { id: 'single', name: 'وجه واحد', multiplier: 1.0 },
      DOUBLE: { id: 'double', name: 'وجهين', multiplier: 1.6 }
    },
    FINISHING: {
      NONE: { id: 'none', name: 'بدون تشطيب', multiplier: 1.0 },
      LAMINATION: { id: 'lamination', name: 'تغليف', multiplier: 1.3 },
      UV: { id: 'uv', name: 'طباعة UV', multiplier: 1.8 },
      EMBOSSING: { id: 'embossing', name: 'نقش بارز', multiplier: 2.0 }
    }
  },

  // حالات الطلب
  ORDER_STATUS: {
    PENDING: { id: 'pending', name: 'في الانتظار', color: '#f39c12' },
    CONFIRMED: { id: 'confirmed', name: 'مؤكد', color: '#3498db' },
    IN_PRODUCTION: { id: 'in_production', name: 'قيد الإنتاج', color: '#9b59b6' },
    READY: { id: 'ready', name: 'جاهز', color: '#27ae60' },
    DELIVERED: { id: 'delivered', name: 'تم التسليم', color: '#2ecc71' },
    CANCELLED: { id: 'cancelled', name: 'ملغي', color: '#e74c3c' }
  },

  // طرق الدفع
  PAYMENT_METHODS: {
    CASH: { id: 'cash', name: 'نقداً عند الاستلام', icon: '💰' },
    CARD: { id: 'card', name: 'بطاقة ائتمان', icon: '💳' },
    BANK_TRANSFER: { id: 'bank_transfer', name: 'تحويل بنكي', icon: '🏦' },
    WALLET: { id: 'wallet', name: 'محفظة رقمية', icon: '📱' }
  },

  // مناطق التوصيل
  DELIVERY_AREAS: {
    INSIDE_RIYADH: { id: 'inside_riyadh', name: 'داخل الرياض', cost: 15 },
    OUTSIDE_RIYADH: { id: 'outside_riyadh', name: 'خارج الرياض', cost: 50 }
  },

  // رسائل خاصة بالمطبعة
  MESSAGES: {
    FILE_UPLOAD_SUCCESS: 'تم رفع الملف بنجاح',
    FILE_UPLOAD_ERROR: 'خطأ في رفع الملف',
    ORDER_SUBMITTED: 'تم إرسال الطلب بنجاح',
    ORDER_CONFIRMED: 'تم تأكيد طلبك',
    ORDER_READY: 'طلبك جاهز للاستلام',
    INVALID_FILE_TYPE: 'نوع الملف غير مدعوم',
    FILE_TOO_LARGE: 'حجم الملف كبير جداً',
    MINIMUM_QUANTITY: 'الكمية أقل من الحد الأدنى',
    MAXIMUM_QUANTITY: 'الكمية أكبر من الحد الأقصى'
  },

  // إعدادات التصميم
  DESIGN_SETTINGS: {
    DPI: 300, // جودة الطباعة
    COLOR_PROFILE: 'CMYK',
    BLEED_SIZE: '3mm', // منطقة القص
    SAFE_AREA: '5mm' // المنطقة الآمنة
  },

  // معلومات الاتصال
  CONTACT_INFO: {
    PHONE: '+966501234567',
    WHATSAPP: '+966501234567',
    EMAIL: 'info@ayaz-printing.com',
    ADDRESS: 'الرياض، المملكة العربية السعودية',
    WORKING_HOURS: 'السبت - الخميس: 8:00 ص - 10:00 م'
  }
};

export default PrintingConfig;