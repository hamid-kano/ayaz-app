import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  BackHandler,
  KeyboardAvoidingView,
  Text,
  Button,
  Image,
  Alert,
  Platform,
  SafeAreaView,
} from "react-native";
import WebView from "react-native-webview";
import * as SplashScreen from "expo-splash-screen";

import NetInfo from "@react-native-community/netinfo";
import * as Updates from "expo-updates";
import OneSignal from "react-native-onesignal";
import * as Device from "expo-device";
import { Share } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProgressBar from "react-native-progress/Bar";

// Import utility tools
import NotificationService from "./utils/notification-service";
import PermissionUtils from "./utils/permission-utils";
import WebErrorHandler from "./utils/web-error-handler";
import AppConfig from "./utils/app-config";
import MediaService from "./utils/media-service-simple";

// منع إخفاء Splash Screen تلقائياً
SplashScreen.preventAutoHideAsync();

const MyWebView = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [recording, setRecording] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastUrl, setLastUrl] = useState(AppConfig.BASE_URL);
  const [appIsReady, setAppIsReady] = useState(false);

  const webViewRef = useRef();
  const deviceType = Device.osName === "iOS" ? "iphone" : "android";

  // Save player ID in WebView
  const injectPlayerIdToWebView = useCallback(
    (id) => {
      if (webViewRef.current && id) {
        const script = `
        try {
          localStorage.setItem('player_id', '${id}');
          localStorage.setItem('device_type', '${deviceType}');
          localStorage.setItem('app_version', '${AppConfig.APP_VERSION}');
          localStorage.setItem('platform', '${Platform.OS}');
          console.log('✅ Device data injected successfully');
        } catch(e) {
          console.error('❌ Error injecting data:', e);
        }
        true;
      `;
        webViewRef.current.injectJavaScript(script);
      }
    },
    [deviceType]
  );

  // Setup OneSignal
  const setupOneSignal = useCallback(async () => {
    try {
      console.log("🔔 Starting setup OneSignal...");

      const onNotificationOpened = (openedEvent) => {
        const url = openedEvent.notification.additionalData?.url;
        if (url && webViewRef.current) {
          console.log("🔗 Opening link from notification:", url);
          webViewRef.current.injectJavaScript(`
            try {
              window.location.href = "${url}";
            } catch(e) {
              console.error('Error opening link:', e);
            }
            true;
          `);
        }
      };

      const onNotificationReceived = (notification) => {
        console.log("📨 Notification received:", notification.title);
      };

      const playerId = await NotificationService.initializeNotifications(
        onNotificationOpened,
        onNotificationReceived
      );

      if (playerId) {
        setPlayerId(playerId);
        injectPlayerIdToWebView(playerId);
        console.log("✅ Successfully configured OneSignal");
      }
    } catch (error) {
      console.error("❌ Error setting up OneSignal:", error);
    }
  }, [injectPlayerIdToWebView]);

  // Ask for permissions
  const requestPermissions = useCallback(async () => {
    try {
      console.log("🔐 Ask for permissions...");
      await PermissionUtils.requestMediaPermissions();
    } catch (error) {
      console.error("❌ Error in asking for permissions:", error);
    }
  }, []);

  // Handle navigation state change
  const handleNavigationStateChange = useCallback((navState) => {
    setCanGoBack(navState.canGoBack);
    setLastUrl(navState.url);
  }, []);

  // Handle back button
  const handleBackButtonWithConfirmation = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    } else {
      Alert.alert(
        AppConfig.CONFIRMATION_MESSAGES.EXIT_TITLE,
        AppConfig.CONFIRMATION_MESSAGES.EXIT_MESSAGE,
        [
          {
            text: AppConfig.CONFIRMATION_MESSAGES.EXIT,
            onPress: () => BackHandler.exitApp(),
            style: "destructive",
          },
          {
            text: AppConfig.CONFIRMATION_MESSAGES.CANCEL,
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
      return true;
    }
  }, [canGoBack]);

  // Handle network with retry
  const handleRefreshAndCheckConnection = useCallback(async () => {
    try {
      console.log("🔄 Checking connection...");
      const state = await NetInfo.fetch();

      if (state.isConnected) {
        setIsConnected(true);
        setRetryCount(0);
        if (webViewRef.current) {
          webViewRef.current.reload();
        }
      } else {
        setIsConnected(false);
        // Automatic retry
        if (retryCount < AppConfig.PERFORMANCE.RETRY_ATTEMPTS) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            handleRefreshAndCheckConnection();
          }, AppConfig.PERFORMANCE.RETRY_DELAY);
        }
      }
    } catch (error) {
      console.error("❌ Error checking connection:", error);
    }
  }, [retryCount]);

  // Handle WebView messages
  const handleWebViewMessage = useCallback(
    (event) => {
      const message = event.nativeEvent.data;

      if (message === "reload") {
        webViewRef.current?.reload();
        return;
      }

      try {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "share") {
          const shareData = parsedMessage.data;
          let shareText = shareData.text || "";
          const shareUrl = shareData.url || "";

          if (shareUrl) {
            shareText += shareText ? "\n\n" + shareUrl : shareUrl;
          }

          // Add app link
          const storeLink =
            deviceType === "android"
              ? AppConfig.PLAY_STORE_LINK
              : AppConfig.APP_STORE_LINK;

          shareText += "\n\nDownload the app:\n" + storeLink;

          Share.share({
            message: shareText,
            title: shareData.title || AppConfig.APP_NAME,
          }).catch((error) => {
            console.error("❌ Error in sharing:", error);
          });
        }
        
        // Handle media actions
        else if (parsedMessage.type === "pickImage") {
          MediaService.pickImageFromGallery().then(result => {
            if (result) {
              webViewRef.current?.postMessage(JSON.stringify({
                type: 'imageSelected',
                data: result
              }));
            }
          });
        }
        
        else if (parsedMessage.type === "takePhoto") {
          MediaService.takePhoto().then(result => {
            if (result) {
              webViewRef.current?.postMessage(JSON.stringify({
                type: 'photoTaken',
                data: result
              }));
            }
          });
        }
        
        else if (parsedMessage.type === "pickDocument") {
          MediaService.pickDocument().then(result => {
            if (result) {
              webViewRef.current?.postMessage(JSON.stringify({
                type: 'documentSelected',
                data: result
              }));
            }
          });
        }
        
        else if (parsedMessage.type === "startRecording") {
          MediaService.startRecording().then(recordingInstance => {
            if (recordingInstance) {
              setRecording(recordingInstance);
              webViewRef.current?.postMessage(JSON.stringify({
                type: 'recordingStarted'
              }));
            }
          });
        }
        
        else if (parsedMessage.type === "stopRecording") {
          if (recording) {
            MediaService.stopRecording(recording).then(result => {
              setRecording(null);
              if (result) {
                webViewRef.current?.postMessage(JSON.stringify({
                  type: 'recordingStopped',
                  data: result
                }));
              }
            });
          }
        }
      } catch (error) {
        console.log("📝 Non-JSON message:", message);
      }
    },
    [deviceType]
  );

  // Effects
  useEffect(() => {
    console.log("🚀 Launching the app...");

    // Initial setup
    const initializeApp = async () => {
      try {
        await requestPermissions();
        await setupOneSignal();
        // إخفاء Splash Screen بعد 3 ثوان كحد أقصى
        setTimeout(() => {
          if (!appIsReady) {
            SplashScreen.hideAsync();
            setAppIsReady(true);
          }
        }, 3000);
      } catch (error) {
        console.error('خطأ في تهيئة التطبيق:', error);
        SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    };

    initializeApp();

    // Network monitor
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const wasOffline = !isConnected;
      setIsConnected(state.isConnected);

      // Reload when connection is restored
      if (wasOffline && state.isConnected && webViewRef.current) {
        setTimeout(() => {
          webViewRef.current.reload();
        }, 1000);
      }
    });

    // Back button handler
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonWithConfirmation
    );

    return () => {
      unsubscribeNetInfo();
      backHandler.remove();
    };
  }, [
    handleBackButtonWithConfirmation,
    requestPermissions,
    setupOneSignal,
    isConnected,
    appIsReady
  ]);

  // Injected JavaScript
  const injectedJavaScript = `
    (function() {
      try {
        // Disable selection
        document.body.style.webkitUserSelect = 'none';
        document.body.style.webkitTouchCallout = 'none';
        
        // Set app data
        localStorage.setItem("app_version", "${AppConfig.APP_VERSION}");
        localStorage.setItem("device_type", "${deviceType}");
        localStorage.setItem("platform", "${Platform.OS}");
        
        // Enhanced sharing support
        if (!window.navigator.share) {
          window.navigator.share = function(data) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'share',
              data: data
            }));
            return Promise.resolve();
          }
        }
        
        // Add device info to window
        window.deviceInfo = {
          type: "${deviceType}",
          platform: "${Platform.OS}",
          version: "${AppConfig.APP_VERSION}"
        };
        
        // Media functions
        window.pickImageFromGallery = function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'pickImage'
          }));
        };
        
        window.takePhoto = function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'takePhoto'
          }));
        };
        
        window.pickDocument = function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'pickDocument'
          }));
        };
        
        window.startRecording = function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'startRecording'
          }));
        };
        
        window.stopRecording = function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'stopRecording'
          }));
        };
        
        console.log('✅ JavaScript loaded successfully');
      } catch(e) {
        console.error('❌ Error in JavaScript:', e);
      }
    })();
    true;
  `;

  // Render
  return (
    <SafeAreaView style={styles.container}>
      {isConnected ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {loading && progress < 1 && (
            <ProgressBar
              progress={progress}
              width={null}
              color={AppConfig.COLORS.PRIMARY}
              borderWidth={0}
              height={4}
              style={styles.progressBar}
            />
          )}

          <WebView
            source={{ uri: lastUrl }}
            ref={webViewRef}
            injectedJavaScript={injectedJavaScript}
            onLoadStart={() => {
              console.log("🔄 Loading Started ...");
              setLoading(true);
            }}
            onLoadProgress={({ nativeEvent }) => {
              setProgress(nativeEvent.progress);
            }}
            onLoad={() => {
              console.log("✅ Uploaded successfully");
              setLoading(false);
              setProgress(1);
              setAppIsReady(true);
              // إخفاء Splash Screen
              SplashScreen.hideAsync();
              // Inject player ID after loading
              if (playerId) {
                injectPlayerIdToWebView(playerId);
              }
            }}
            onError={({ nativeEvent }) => {
              console.error("❌ Error loading:", nativeEvent);
              WebErrorHandler.handleWebError(webViewRef, nativeEvent);
            }}
            onMessage={handleWebViewMessage}
            injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
            onShouldStartLoadWithRequest={(request) => {
              const url = request.url;

              // Allow internal links
              if (url.startsWith(AppConfig.BASE_URL)) {
                return true;
              }

              // Open external links in browser
              if (url.startsWith("http")) {
                return false;
              }

              return true;
            }}
            onNavigationStateChange={handleNavigationStateChange}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={AppConfig.COLORS.PRIMARY}
                />
                <Text style={styles.loadingText}>جاري التحميل...</Text>
              </View>
            )}
            {...AppConfig.WEBVIEW_SETTINGS}
          />

          <StatusBar
            translucent={false}
            style="light"
            backgroundColor={AppConfig.COLORS.SECONDARY}
          />
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.offlineContainer}>
          <Image
            source={require("./assets/net.png")}
            style={styles.offlineImage}
          />
          <Text style={styles.offlineTitle}>لا يوجد اتصال بالإنترنت</Text>
          <Text style={styles.offlineMessage}>
            يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى
          </Text>

          <Button
            title={
              retryCount > 0
                ? `إعادة المحاولة (${retryCount})`
                : "تحديث الاتصال"
            }
            onPress={handleRefreshAndCheckConnection}
            color={AppConfig.COLORS.PRIMARY}
          />

          {retryCount > 0 && (
            <Text style={styles.retryText}>
              جاري إعادة المحاولة تلقائياً...
            </Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppConfig.COLORS.PRIMARY,
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppConfig.COLORS.WHITE,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: AppConfig.COLORS.TEXT_SECONDARY,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppConfig.COLORS.WHITE,
    padding: 20,
  },
  offlineImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  offlineTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: AppConfig.COLORS.TEXT_PRIMARY,
    marginBottom: 10,
    textAlign: "center",
  },
  offlineMessage: {
    fontSize: 16,
    color: AppConfig.COLORS.TEXT_SECONDARY,
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 24,
  },
  retryText: {
    marginTop: 15,
    fontSize: 14,
    color: AppConfig.COLORS.TEXT_SECONDARY,
    textAlign: "center",
  },
});

export default MyWebView;
