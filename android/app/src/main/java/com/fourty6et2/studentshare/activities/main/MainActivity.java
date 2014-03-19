package com.fourty6et2.studentshare.activities.main;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import com.fourty6et2.studentshare.Config;
import com.fourty6et2.studentshare.Helpers;
import com.fourty6et2.studentshare.R;
import com.fourty6et2.studentshare.Section;
import com.fourty6et2.studentshare.SectionsPagerAdapter;
import com.fourty6et2.studentshare.StudentShareApi;
import com.fourty6et2.studentshare.activities.add.AddActivity;
import com.fourty6et2.studentshare.activities.add.IAddDelegate;
import com.fourty6et2.studentshare.fragments.chat.ChatSectionFragment;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.apache.http.Header;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicInteger;

public class MainActivity extends FragmentActivity implements ViewPager.OnPageChangeListener {

	private SectionsPagerAdapter _sectionsPagerAdapter;
	private ViewPager _viewPager;

    Context context;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		_sectionsPagerAdapter = new SectionsPagerAdapter(this);

		_viewPager = (ViewPager) findViewById(R.id.pager);
		_viewPager.setAdapter(_sectionsPagerAdapter);
        _viewPager.setOnPageChangeListener(this);

        context = getApplicationContext();

        if (checkPlayServices()) {
            Config.gcm = GoogleCloudMessaging.getInstance(this);
            Config.DeviceRegistrationId = getRegistrationId(context);

            if (Config.DeviceRegistrationId.isEmpty()) {
                registerInBackground();
            }

        } else {
            Log.i(Config.TAG, "No valid Google Play Services APK found.");
        }
	}

    @Override
    protected void onResume() {
        super.onResume();

        Intent i = getIntent();
        if (i != null && i.hasExtra("SShare")) {
            String tab = i.getStringExtra("tab");

            Section.AsEnum section = Helpers.getSectionFromString(tab);
            if (section == Section.AsEnum.Borrow) {
                _viewPager.setCurrentItem(Section.AsEnum.Borrow.ordinal());
            } else if (section == Section.AsEnum.Sell) {
                _viewPager.setCurrentItem(Section.AsEnum.Sell.ordinal());
            } else if (section == Section.AsEnum.Buy) {
                _viewPager.setCurrentItem(Section.AsEnum.Buy.ordinal());
            } else if (section == Section.AsEnum.Chat) {
                _viewPager.setCurrentItem(Section.AsEnum.Chat.ordinal());
            }
        }

        checkPlayServices();
    }

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.main, menu);

        Fragment fragment = _sectionsPagerAdapter.getItem(_viewPager.getCurrentItem());

        if (fragment instanceof ChatSectionFragment) {
            menu.findItem(R.id.MenuItemAdd).setVisible(false);
        } else {
            menu.findItem(R.id.MenuItemAdd).setVisible(true);
        }

		return true;
	}

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.MenuItemAdd:

                if (!Config.Authenticate(this))
                    return super.onOptionsItemSelected(item);;

                Fragment fragment = _sectionsPagerAdapter.getItem(_viewPager.getCurrentItem());
                if (fragment instanceof IAddDelegate) {
                    ((IAddDelegate) fragment).add(this);
                }
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {}

    @Override
    public void onPageSelected(int position) {
        invalidateOptionsMenu();
    }

    @Override
    public void onPageScrollStateChanged(int state) {}

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        Fragment fragment = _sectionsPagerAdapter.getItem(_viewPager.getCurrentItem());
        if (fragment instanceof IAddDelegate) {
            fragment.onActivityResult(requestCode, resultCode, data);
        }
    }

    // GCM
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    private boolean checkPlayServices() {
        int resultCode = GooglePlayServicesUtil.isGooglePlayServicesAvailable(this);
        if (resultCode != ConnectionResult.SUCCESS) {
            if (GooglePlayServicesUtil.isUserRecoverableError(resultCode)) {
                GooglePlayServicesUtil.getErrorDialog(resultCode, this, Config.PLAY_SERVICES_RESOLUTION_REQUEST).show();
            } else {
                Log.i(Config.TAG, "This device is not supported.");
                finish();
            }
            return false;
        }
        return true;
    }

    private String getRegistrationId(Context context) {
        final SharedPreferences prefs = getGCMPreferences(context);
        String registrationId = prefs.getString(Config.PROPERTY_REG_ID, "");
        if (registrationId.isEmpty()) {
            Log.i(Config.TAG, "Registration not found.");
            return "";
        }
        // Check if app was updated; if so, it must clear the registration ID
        // since the existing regID is not guaranteed to work with the new
        // app version.
        int registeredVersion = prefs.getInt(Config.PROPERTY_APP_VERSION, Integer.MIN_VALUE);
        int currentVersion = getAppVersion(context);
        if (registeredVersion != currentVersion) {
            Log.i(Config.TAG, "App version changed.");
            return "";
        }
        return registrationId;
    }

    private SharedPreferences getGCMPreferences(Context context) {
        // This sample app persists the registration ID in shared preferences, but
        // how you store the regID in your app is up to you.
        return getSharedPreferences(MainActivity.class.getSimpleName(),
                Context.MODE_PRIVATE);
    }

    private static int getAppVersion(Context context) {
        try {
            PackageInfo packageInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
            return packageInfo.versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            // should never happen
            throw new RuntimeException("Could not get package name: " + e);
        }
    }

    private void registerInBackground() {
        new AsyncTask<Void, Void, String>() {
            @Override
            protected String doInBackground(Void... params) {
                String msg = "";
                try {
                    if (Config.gcm == null) {
                        Config.gcm = GoogleCloudMessaging.getInstance(context);
                    }
                    Config.DeviceRegistrationId = Config.gcm.register(Config.SENDER_ID);
                    msg = "Device registered, registration ID=" + Config.DeviceRegistrationId ;

                    // You should send the registration ID to your server over HTTP, so it
                    // can use GCM/HTTP or CCS to send messages to your app.
//                    sendRegistrationIdToBackend(); // Can't create handler inside thread that has not called Looper.prepare()

                    // For this demo: we don't need to send it because the device will send
                    // upstream messages to a server that echo back the message using the
                    // 'from' address in the message.

                    // Persist the regID - no need to register again.
                    storeRegistrationId(context, Config.DeviceRegistrationId);
                } catch (IOException ex) {
                    msg = "Error :" + ex.getMessage();
                    // If there is an error, don't just keep trying to register.
                    // Require the user to click a button again, or perform
                    // exponential back-off.
                }
                return msg;
            }

            @Override
            protected void onPostExecute(String msg) {
                // You should send the registration ID to your server over HTTP, so it
                // can use GCM/HTTP or CCS to send messages to your app.
                sendRegistrationIdToBackend();
            }
        }.execute(null, null, null);
    }

    private void storeRegistrationId(Context context, String regId) {
        final SharedPreferences prefs = getGCMPreferences(context);
        int appVersion = getAppVersion(context);
        Log.i(Config.TAG, "Saving regId on app version " + appVersion);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString(Config.PROPERTY_REG_ID, regId);
        editor.putInt(Config.PROPERTY_APP_VERSION, appVersion);
        editor.commit();
    }

    private void sendRegistrationIdToBackend() {
        StudentShareApi.SaveDeviceRegistrationId(Config.DeviceRegistrationId, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                int a = 0;
            }

            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                int a = 0;
            }

            @Override
            public void onSuccess(int statusCode, Header[] headers, String responseString) {
                int a = 0;
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                if (statusCode != 200) {
                    Helpers.showNotificationBubble(R.string.GcmRegistrationFailed, context);
                } else {}
            }
        });
    }
}
