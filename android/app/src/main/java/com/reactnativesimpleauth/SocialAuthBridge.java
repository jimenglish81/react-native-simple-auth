package com.reactnativesimpleauth;

import org.brickred.socialauth.android.SocialAuthAdapter;
import org.brickred.socialauth.android.SocialAuthAdapter.Provider;
import org.brickred.socialauth.android.SocialAuthError;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.*;

public class SocialAuthBridge extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private SocialAuthAdapter adapter;

    public SocialAuthBridge(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SocialAuthBridge";
    }

    @ReactMethod
    public void configure(String provider, Map<String,Object>config, Callback callback) {
        SimpleAuth.configuration[provider] = config;
        callback(provider);
    }

    @ReactMethod
    public void authorize(String provider, Callback callback) {
        adapter = new SocialAuthAdapter(new ResponseListener());
        adapter.authorize(this, provider)
        callback(provider);
    }

    @ReactMethod
    public void show(ReadableMap options) throws Exception {
      adapter = new SocialAuthAdapter(new ResponseListener());

      //TODO - figure out what to replace drawbable with?
      adapter.addProvider(Provider.TWITTER, R.drawable.twitter);
      adapter.addProvider(Provider.LINKEDIN, R.drawable.linkedin);

      //adapter.authorize(MainActivity.this, Provider.LINKEDIN);
      // For twitter use add callback method. Put your own callback url here.
      //  adapter.addCallBack(Provider.TWITTER,
      //          "http://socialauth.in/socialauthdemo/socialAuthSuccessAction.do");

       // Add keys and Secrets
      //  try {
      //      adapter.addConfig(Provider.FACEBOOK, "297841130364674",
      //              "dc9c59d0c72d4f2533580e80ba4c2a59", null);
      //      adapter.addConfig(Provider.TWITTER, "5jwyYJia583EEczmdAmlOA",
      //              "j0rQkJjTjwVdv7HFiE4zz2qKJKzqjksR2aviVU8fSc", null);
      //      adapter.addConfig(Provider.LINKEDIN, "bh82t52rdos6",
      //              "zQ1LLrGbhDZ36fH8", null);
      //  } catch (Exception e) {
      //      e.printStackTrace();
      //  }
      //  adapter.enable(bar);
    }

    // @Override
    // public void onError(SocialAuthError error) {
    //     //Log.d("ShareButton", "Authentication Error: " + error.getMessage());
    // }
}
