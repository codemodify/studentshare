package com.fourty6et2.studentshare;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.AsyncTask;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import com.fourty6et2.studentshare.activities.main.MainActivity;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.gcm.GoogleCloudMessaging;

import java.io.IOException;

public class Helpers {

    private static ProgressDialog progress = null;

    public static void showSpinnerProgress(int stringId, Context context) {
        progress = new ProgressDialog(context);
        progress.setTitle(stringId);
        progress.show();
    }

    public static void hideSpinnerProgress() {
        if (progress == null)
            return;

        progress.dismiss();
    }

    public static Context getSpinnerProgressContext() {
        if (progress == null)
            return null;

        return progress.getContext();
    }

    public static void showNotificationBubble(int stringId, Context context) {
        Toast.makeText(context, stringId, Toast.LENGTH_LONG).show();
    }

    public static String stringToBase64(String value) {
        String valueAsBase64 = "q";

        try {
            byte[] valueAsBytes = value.getBytes("UTF-8");
            valueAsBase64 = Base64.encodeToString(valueAsBytes, Base64.DEFAULT).trim();
        } catch (Exception e) {}

        return valueAsBase64;
    }

    public static int getDrawableIdByType(String type) {
        if (type.toLowerCase().equals(ItemType.AsString.Car))
            return R.drawable.car;

        if (type.toLowerCase().equals(ItemType.AsString.Bike))
            return R.drawable.bike;

        return R.drawable.other;
    }

    public static ItemType.AsEnum getItemTypeFromInt(int itemTypeAsInt) {
        if (itemTypeAsInt == ItemType.AsEnum.Car.ordinal())
            return ItemType.AsEnum.Car;

        if (itemTypeAsInt == ItemType.AsEnum.Bike.ordinal())
            return ItemType.AsEnum.Bike;

        return ItemType.AsEnum.Other;
    }

    public static String getTypeAsStrignFromItemTypeAsInt(ItemType.AsEnum itemType) {
        if (itemType == ItemType.AsEnum.Car)
            return ItemType.AsString.Car;

        if (itemType == ItemType.AsEnum.Bike)
            return ItemType.AsString.Bike;

        return ItemType.AsString.Other;
    }

    public static Section.AsEnum getSectionFromString(String sectionAsString) {
        if (sectionAsString.toLowerCase().equals(Section.AsString.Borrow))
            return Section.AsEnum.Borrow;

        if (sectionAsString.toLowerCase().equals(Section.AsString.Sell))
            return Section.AsEnum.Sell;

        if (sectionAsString.toLowerCase().equals(Section.AsString.Buy))
            return Section.AsEnum.Buy;

        return Section.AsEnum.Chat;
    }
}
