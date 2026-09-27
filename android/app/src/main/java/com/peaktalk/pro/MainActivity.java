package com.peaktalk.pro;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import android.app.Dialog;
import android.os.Message;
import android.webkit.WebViewClient;
import com.getcapacitor.BridgeActivity;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {
    private static final int PERMISSION_REQ_CODE = 1001;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Ensure status bar & navigation bar do not overlap web content
        androidx.core.view.WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            getWindow().setStatusBarColor(android.graphics.Color.parseColor("#F5F7FA"));
            androidx.core.view.WindowInsetsControllerCompat insetsController = 
                androidx.core.view.WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
            if (insetsController != null) {
                insetsController.setAppearanceLightStatusBars(true);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    insetsController.setAppearanceLightNavigationBars(true);
                }
            }
        }
        requestRequiredPermissions();
    }

    private void requestRequiredPermissions() {
        List<String> neededPermissions = new ArrayList<>();
        
        // Microphone / Voice permission
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            neededPermissions.add(Manifest.permission.RECORD_AUDIO);
        }

        // Notification permission for Android 13+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                neededPermissions.add(Manifest.permission.POST_NOTIFICATIONS);
            }
        }

        if (!neededPermissions.isEmpty()) {
            ActivityCompat.requestPermissions(this, neededPermissions.toArray(new String[0]), PERMISSION_REQ_CODE);
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView webView = this.bridge.getWebView();
            WebSettings settings = webView.getSettings();
            // Allow auto audio playback and voice
            settings.setMediaPlaybackRequiresUserGesture(false);
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            settings.setSupportMultipleWindows(true);
            settings.setJavaScriptCanOpenWindowsAutomatically(true);

            // Strip '; wv' to allow Google OAuth inside WebView without 403 disallowed_useragent
            String defaultUa = settings.getUserAgentString();
            if (defaultUa != null && defaultUa.contains("; wv")) {
                settings.setUserAgentString(defaultUa.replace("; wv", ""));
            }

            // Grant WebRTC and audio permissions automatically & handle Google Sign-In popups
            webView.setWebChromeClient(new WebChromeClient() {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            request.grant(request.getResources());
                        }
                    });
                }

                @Override
                public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, Message resultMsg) {
                    final Dialog dialog = new Dialog(MainActivity.this, android.R.style.Theme_DeviceDefault_Light_NoActionBar_Fullscreen);
                    final WebView popupWebView = new WebView(MainActivity.this);
                    WebSettings popupSettings = popupWebView.getSettings();
                    popupSettings.setJavaScriptEnabled(true);
                    popupSettings.setDomStorageEnabled(true);
                    popupSettings.setDatabaseEnabled(true);
                    popupSettings.setSupportMultipleWindows(true);
                    popupSettings.setJavaScriptCanOpenWindowsAutomatically(true);
                    
                    String pUa = popupSettings.getUserAgentString();
                    if (pUa != null && pUa.contains("; wv")) {
                        popupSettings.setUserAgentString(pUa.replace("; wv", ""));
                    }

                    popupWebView.setWebViewClient(new WebViewClient() {
                        @Override
                        public boolean shouldOverrideUrlLoading(WebView v, String url) {
                            return false;
                        }
                    });

                    popupWebView.setWebChromeClient(new WebChromeClient() {
                        @Override
                        public void onCloseWindow(WebView window) {
                            if (dialog.isShowing()) {
                                dialog.dismiss();
                            }
                            popupWebView.destroy();
                        }
                    });

                    dialog.setContentView(popupWebView);
                    dialog.show();

                    WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                    transport.setWebView(popupWebView);
                    resultMsg.sendToTarget();
                    return true;
                }
            });
        }
    }
}
