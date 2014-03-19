package com.fourty6et2.studentshare;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.widget.EditText;

import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.apache.http.Header;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.concurrent.atomic.AtomicInteger;

public class Config {

    public static com.fourty6et2.studentshare.models.User User = null;

    public static String DeviceRegistrationId = "";

    public static GoogleCloudMessaging gcm;
    public static AtomicInteger msgId = new AtomicInteger();
    public static SharedPreferences prefs;

    public static final String EXTRA_MESSAGE = "message";
    public static final String PROPERTY_REG_ID = "registration_id";
    public static final String PROPERTY_APP_VERSION = "appVersion";
    public static final int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;
    public static final String SENDER_ID = "847946917519"; // This is the project number
    public static final String TAG = "GCMDemo";

    public static boolean isAuthenticated() {
        return User != null;
    }

    public static String getUserId() {
        if (isAuthenticated())
            return User.Id;

        return StudentShareApi.EmptyId;
    }

    public static boolean Authenticate(Activity activity) {

        if (isAuthenticated()) {
            return true;
        }

        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder .setView(activity.getLayoutInflater().inflate(R.layout.fragment_authenticate, null))
                .setTitle(R.string.AuthenticationTitle)
                .setPositiveButton(R.string.AuthenticationLoginButton, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int id) {

                        AlertDialog alert = ((AlertDialog) dialog);

                        String user = ((EditText) alert.findViewById(R.id.User)).getText().toString();
                        String password = ((EditText) alert.findViewById(R.id.Password)).getText().toString();

                        // FIXME: remove this
                        user = "nicu";
                        password = "fckgwrhqq2";

                        Helpers.showSpinnerProgress(R.string.AuthenticationLoading, alert.getContext());

                        StudentShareApi.LoginUser(user, password, Config.DeviceRegistrationId, new JsonHttpResponseHandler() {
                            @Override
                            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                                try {
                                    User = new com.fourty6et2.studentshare.models.User();
                                    User.Id = response.getString("Id");
                                    User.Name = response.getString("Name");
                                    User.Pass = response.getString("Pass");
                                    User.Email = response.getString("Email");
                                } catch (JSONException e) {
                                    User = null;
                                }

                                Helpers.hideSpinnerProgress();

                                if (User == null) {
                                    Helpers.showNotificationBubble(R.string.AuthenticationFailed, Helpers.getSpinnerProgressContext());
                                } else {
                                    Helpers.showNotificationBubble(R.string.AuthenticationSucceeded, Helpers.getSpinnerProgressContext());
                                }
                            }

                            @Override
                            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                                User = null;
                                Helpers.hideSpinnerProgress();
                                Helpers.showNotificationBubble(R.string.AuthenticationFailed, Helpers.getSpinnerProgressContext());
                            }
                        });
                    }
                })
                .setNegativeButton(R.string.AuthenticationRegisterButton, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {

                        AlertDialog alert = ((AlertDialog) dialog);

                        String user = ((EditText) alert.findViewById(R.id.User)).getText().toString();
                        String password = ((EditText) alert.findViewById(R.id.Password)).getText().toString();

                        Helpers.showSpinnerProgress(R.string.RegistrationLoading, alert.getContext());

                        StudentShareApi.RegisterUser(user, password, Config.DeviceRegistrationId, new JsonHttpResponseHandler() {
                            @Override
                            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                                try {
                                    User = new com.fourty6et2.studentshare.models.User();
                                    User.Id = response.getString("Id");
                                    User.Name = response.getString("Name");
                                    User.Pass = response.getString("Pass");
                                    User.Email = response.getString("Email");
                                } catch (JSONException e) {
                                    User = null;
                                }

                                Helpers.hideSpinnerProgress();

                                if (User == null) {
                                    Helpers.showNotificationBubble(R.string.RegistrationFailed, Helpers.getSpinnerProgressContext());
                                } else {
                                    Helpers.showNotificationBubble(R.string.RegistrationSucceeded, Helpers.getSpinnerProgressContext());
                                }
                            }

                            @Override
                            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                                User = null;
                                Helpers.hideSpinnerProgress();
                                Helpers.showNotificationBubble(R.string.RegistrationFailed, Helpers.getSpinnerProgressContext());
                            }
                        });
                    }
                });

        AlertDialog dialog = builder.create();
        dialog.show();

        return false;
    }
}
