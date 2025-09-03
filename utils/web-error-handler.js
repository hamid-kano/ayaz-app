import AppConfig from './app-config';

/**
 * معالج أخطاء الويب المحسن
 */
export default class WebErrorHandler {
  
  /**
   * عرض صفحة الخطأ مع تصميم محسن
   * @param {Object} webViewRef مرجع WebView
   * @param {string} title عنوان الخطأ
   * @param {string} message رسالة الخطأ
   * @param {string} errorType نوع الخطأ
   */
  static showErrorPage(webViewRef, title, message, errorType = 'general') {
    if (!webViewRef.current) return;

    const colors = AppConfig.COLORS;
    const errorIcon = this.getErrorIcon(errorType);
    const suggestions = this.getErrorSuggestions(errorType);

    const errorHtml = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>خطأ في التحميل</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, ${colors.BACKGROUND} 0%, #e3f2fd 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            direction: rtl;
          }
          
          .error-container {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
            animation: slideUp 0.5s ease-out;
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .error-icon {
            font-size: 80px;
            margin-bottom: 20px;
            animation: bounce 2s infinite;
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
          
          .error-title {
            color: ${colors.TEXT_PRIMARY};
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
          }
          
          .error-message {
            color: ${colors.TEXT_SECONDARY};
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          
          .suggestions {
            background: ${colors.BACKGROUND};
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: right;
          }
          
          .suggestions h3 {
            color: ${colors.TEXT_PRIMARY};
            font-size: 18px;
            margin-bottom: 15px;
          }
          
          .suggestions ul {
            list-style: none;
            padding: 0;
          }
          
          .suggestions li {
            color: ${colors.TEXT_SECONDARY};
            font-size: 14px;
            margin-bottom: 8px;
            padding-right: 20px;
            position: relative;
          }
          
          .suggestions li:before {
            content: "•";
            color: ${colors.PRIMARY};
            font-weight: bold;
            position: absolute;
            right: 0;
          }
          
          .retry-button {
            background: linear-gradient(135deg, ${colors.PRIMARY} 0%, #1e88e5 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            font-family: inherit;
            font-size: 16px;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(44, 123, 229, 0.3);
            margin-bottom: 15px;
            width: 100%;
          }
          
          .retry-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(44, 123, 229, 0.4);
          }
          
          .retry-button:active {
            transform: translateY(0);
          }
          
          .footer-text {
            font-size: 12px;
            color: ${colors.TEXT_SECONDARY};
            margin-top: 20px;
            line-height: 1.4;
          }
          
          .app-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: ${colors.TEXT_SECONDARY};
          }
          
          @media (max-width: 480px) {
            .error-container {
              padding: 30px 20px;
              margin: 10px;
            }
            
            .error-icon {
              font-size: 60px;
            }
            
            .error-title {
              font-size: 20px;
            }
            
            .error-message {
              font-size: 14px;
            }
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <div class="error-icon">${errorIcon}</div>
          <h1 class="error-title">${title}</h1>
          <p class="error-message">${message}</p>
          
          ${suggestions ? `
            <div class="suggestions">
              <h3>اقتراحات للحل:</h3>
              <ul>
                ${suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          <button class="retry-button" onclick="retryConnection()">
            🔄 إعادة المحاولة
          </button>
          
          <p class="footer-text">
            إذا استمرت المشكلة، يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقاً
          </p>
          
          <div class="app-info">
            ${AppConfig.APP_NAME} - ${AppConfig.APP_VERSION}
          </div>
        </div>
        
        <script>
          function retryConnection() {
            const button = document.querySelector('.retry-button');
            button.innerHTML = '⏳ جاري إعادة المحاولة...';
            button.disabled = true;
            
            setTimeout(() => {
              window.ReactNativeWebView.postMessage('reload');
            }, 1000);
          }
          
          // إعادة المحاولة التلقائية بعد 30 ثانية
          setTimeout(() => {
            const button = document.querySelector('.retry-button');
            if (button && !button.disabled) {
              button.click();
            }
          }, 30000);
        </script>
      </body>
      </html>
    `;

    webViewRef.current.injectJavaScript(`
      document.open();
      document.write(\`${errorHtml.replace(/`/g, '\\`')}\`);
      document.close();
      true;
    `);
  }

  /**
   * الحصول على أيقونة الخطأ حسب النوع
   * @param {string} errorType نوع الخطأ
   * @returns {string} أيقونة الخطأ
   */
  static getErrorIcon(errorType) {
    const icons = {
      network: '🌐',
      ssl: '🔒',
      timeout: '⏰',
      server: '🖥️',
      file: '📄',
      redirect: '🔄',
      general: '⚠️'
    };
    
    return icons[errorType] || icons.general;
  }

  /**
   * الحصول على اقتراحات الحل حسب نوع الخطأ
   * @param {string} errorType نوع الخطأ
   * @returns {Array<string>} قائمة الاقتراحات
   */
  static getErrorSuggestions(errorType) {
    const suggestions = {
      network: [
        'تحقق من اتصالك بالإنترنت',
        'جرب التبديل بين WiFi والبيانات المحمولة',
        'أعد تشغيل جهاز التوجيه إذا كنت تستخدم WiFi',
        'تأكد من أن البيانات المحمولة مفعلة'
      ],
      ssl: [
        'تحقق من صحة التاريخ والوقت على جهازك',
        'جرب الاتصال بشبكة مختلفة',
        'أعد تشغيل التطبيق',
        'تحقق من إعدادات الأمان في جهازك'
      ],
      timeout: [
        'تحقق من سرعة الإنترنت',
        'جرب الاتصال بشبكة أسرع',
        'أغلق التطبيقات الأخرى التي تستخدم الإنترنت',
        'انتظر قليلاً ثم أعد المحاولة'
      ],
      server: [
        'الخادم قد يكون مشغولاً، جرب لاحقاً',
        'تحقق من حالة الخدمة على موقعنا',
        'أعد تشغيل التطبيق',
        'تواصل مع الدعم الفني إذا استمرت المشكلة'
      ],
      file: [
        'تحقق من مساحة التخزين المتاحة',
        'أعد تشغيل التطبيق',
        'امسح ذاكرة التخزين المؤقت',
        'تأكد من أن الملف موجود'
      ],
      redirect: [
        'امسح ذاكرة التخزين المؤقت للتطبيق',
        'أعد تشغيل التطبيق',
        'تحقق من إعدادات الشبكة',
        'جرب شبكة مختلفة'
      ]
    };
    
    return suggestions[errorType] || suggestions.general || [
      'أعد تشغيل التطبيق',
      'تحقق من اتصالك بالإنترنت',
      'جرب لاحقاً',
      'تواصل مع الدعم الفني'
    ];
  }

  /**
   * معالجة أخطاء الويب مع تصنيف محسن
   * @param {Object} webViewRef مرجع WebView
   * @param {Object} error كائن الخطأ
   */
  static handleWebError(webViewRef, error) {
    const errorDesc = (error.description || error.message || '').toLowerCase();
    const errorCode = error.code || '';
    const url = error.url || '';

    // طباعة معلومات الخطأ للتشخيص
    console.log('🚨 WebView Error Details:', {
      code: errorCode,
      description: error.description,
      message: error.message,
      url: url,
      timestamp: new Date().toISOString()
    });

    // تصنيف الأخطاء وعرض الرسالة المناسبة
    if (this.isNetworkConnectivityError(errorCode, errorDesc)) {
      this.showErrorPage(
        webViewRef,
        AppConfig.ERROR_MESSAGES.NO_INTERNET,
        AppConfig.ERROR_MESSAGES.NO_INTERNET_DESC,
        'network'
      );
    } else if (this.isSSLError(errorCode, errorDesc)) {
      this.showErrorPage(
        webViewRef,
        AppConfig.ERROR_MESSAGES.SSL_ERROR,
        AppConfig.ERROR_MESSAGES.SSL_ERROR_DESC,
        'ssl'
      );
    } else if (this.isTimeoutError(errorDesc)) {
      this.showErrorPage(
        webViewRef,
        AppConfig.ERROR_MESSAGES.TIMEOUT,
        AppConfig.ERROR_MESSAGES.TIMEOUT_DESC,
        'timeout'
      );
    } else if (this.isPageNotAvailableError(errorDesc)) {
      this.showErrorPage(
        webViewRef,
        AppConfig.ERROR_MESSAGES.PAGE_NOT_AVAILABLE,
        AppConfig.ERROR_MESSAGES.PAGE_NOT_AVAILABLE_DESC,
        'server'
      );
    } else if (this.isTooManyRedirectsError(errorDesc)) {
      this.showErrorPage(
        webViewRef,
        AppConfig.ERROR_MESSAGES.TOO_MANY_REDIRECTS,
        AppConfig.ERROR_MESSAGES.TOO_MANY_REDIRECTS_DESC,
        'redirect'
      );
    } else if (this.isFileError(errorDesc)) {
      this.showErrorPage(
        webViewRef,
        AppConfig.ERROR_MESSAGES.FILE_ERROR,
        AppConfig.ERROR_MESSAGES.FILE_ERROR_DESC,
        'file'
      );
    } else if (this.isNetworkChangeError(errorDesc)) {
      this.showErrorPage(
        webViewRef,
        AppConfig.ERROR_MESSAGES.NETWORK_CHANGED,
        AppConfig.ERROR_MESSAGES.NETWORK_CHANGED_DESC,
        'network'
      );
    } else if (this.isConnectionClosedError(errorDesc)) {
      this.showErrorPage(
        webViewRef,
        AppConfig.ERROR_MESSAGES.CONNECTION_CLOSED,
        AppConfig.ERROR_MESSAGES.CONNECTION_CLOSED_DESC,
        'network'
      );
    } else {
      this.showErrorPage(
        webViewRef,
        AppConfig.ERROR_MESSAGES.GENERAL_ERROR,
        AppConfig.ERROR_MESSAGES.GENERAL_ERROR_DESC,
        'general'
      );
    }

    // إرسال تقرير الخطأ للتحليل (اختياري)
    this.reportError(error);
  }

  /**
   * إرسال تقرير الخطأ للتحليل
   * @param {Object} error كائن الخطأ
   */
  static reportError(error) {
    try {
      // يمكن إضافة خدمة تحليل الأخطاء هنا مثل Crashlytics
      const errorReport = {
        timestamp: new Date().toISOString(),
        code: error.code,
        description: error.description,
        message: error.message,
        url: error.url,
        userAgent: navigator.userAgent,
        appVersion: AppConfig.APP_VERSION
      };
      
      console.log('📊 Error Report:', errorReport);
      
      // يمكن إرسال التقرير إلى خدمة التحليل
      // Analytics.recordError(errorReport);
    } catch (reportError) {
      console.error('❌ خطأ في إرسال تقرير الخطأ:', reportError);
    }
  }

  // دوال مساعدة محسنة لتصنيف الأخطاء
  static isNetworkConnectivityError(errorCode, errorDesc) {
    const networkErrors = [
      'net::err_internet_disconnected',
      'net::err_address_unreachable',
      'net::err_connection_timed_out',
      'net::err_network_access_denied',
      'network error',
      'failed to connect',
      'no internet',
      'connection failed',
      'network unreachable'
    ];
    
    return networkErrors.some(error => errorDesc.includes(error));
  }

  static isSSLError(errorCode, errorDesc) {
    const sslErrors = [
      'ssl',
      'certificate',
      'net::err_cert_',
      'net::err_ssl_',
      'security error',
      'handshake failed'
    ];
    
    return sslErrors.some(error => errorDesc.includes(error));
  }

  static isTimeoutError(errorDesc) {
    const timeoutErrors = [
      'net::err_timed_out',
      'timeout',
      'timed out',
      'request timeout',
      'connection timeout'
    ];
    
    return timeoutErrors.some(error => errorDesc.includes(error));
  }

  static isPageNotAvailableError(errorDesc) {
    const pageErrors = [
      'web page not available',
      'net::err_name_not_resolved',
      'net::err_connection_refused',
      'net::err_aborted',
      '404',
      'not found',
      'server not found',
      'host not found'
    ];
    
    return pageErrors.some(error => errorDesc.includes(error));
  }

  static isNetworkChangeError(errorDesc) {
    const networkChangeErrors = [
      'net::err_network_change',
      'net::err_network_changed',
      'network_change',
      'network changed'
    ];
    
    return networkChangeErrors.some(error => errorDesc.includes(error));
  }

  static isConnectionClosedError(errorDesc) {
    const connectionErrors = [
      'net::err_connection_closed',
      'net::err_connection_reset',
      'connection closed',
      'connection reset',
      'connection aborted'
    ];
    
    return connectionErrors.some(error => errorDesc.includes(error));
  }

  static isTooManyRedirectsError(errorDesc) {
    const redirectErrors = [
      'net::err_too_many_redirects',
      'redirect',
      'too many redirects',
      'redirect loop'
    ];
    
    return redirectErrors.some(error => errorDesc.includes(error));
  }

  static isFileError(errorDesc) {
    const fileErrors = [
      'net::err_file_',
      'file error',
      'file not found',
      'access denied'
    ];
    
    return fileErrors.some(error => errorDesc.includes(error));
  }
}