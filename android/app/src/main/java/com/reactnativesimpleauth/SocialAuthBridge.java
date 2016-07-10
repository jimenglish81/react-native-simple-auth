package com.reactnativesimpleauth;

import android.widget.Toast;
import org.brickred.socialauth.android.SocialAuthAdapter;
import org.brickred.socialauth.android.SocialAuthAdapter.Provider;
import org.brickred.socialauth.android.SocialAuthError;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;

public class SocialAuthBridge extends ReactContextBaseJavaModule {

  private SocialAuthAdapter adapter = new SocialAuthAdapter(new ResponseListener());

  public SocialAuthBridge(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "SocialAuthBridge";
  }

  @ReactMethod
  public void configure(String provider, Map<String,Object>config, Callback callback) {
    //SimpleAuth.configuration[provider] = config;
    callback.invoke(provider);
  }

  @ReactMethod
  public void authorize(String provider, Callback callback) {
    adapter.authorize(getActivity(), provider);
    callback.invoke(provider);
  }
}
