package com.fourty6et2.studentshare.activities.add;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;

import com.fourty6et2.studentshare.Helpers;
import com.fourty6et2.studentshare.ItemType;
import com.fourty6et2.studentshare.R;

public class AddActivity extends Activity {

    public final static String DataType = "Type";
    public final static String DataPhone = "Phone";
    public final static String DataEmail = "Email";
    public final static String DataDescription = "Description";
    public final static String DataPrice = "Price";

	@Override
	protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add);

        ArrayAdapter adapter = new ArrayAdapter(this, android.R.layout.simple_spinner_item, new String[]{
            ItemType.AsString.Car,
            ItemType.AsString.Bike,
            ItemType.AsString.Other
        });

        Spinner addActivityTypeValue = (Spinner) findViewById(R.id.AddActivityTypeValue);
        addActivityTypeValue.setAdapter(adapter);

        Button addActivityButton = (Button) findViewById(R.id.AddActivityButton);
        addActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                Spinner addActivityTypeValue = (Spinner) findViewById(R.id.AddActivityTypeValue);
                EditText addActivityPhoneValue = (EditText) findViewById(R.id.AddActivityPhoneValue);
                EditText addActivityEmailValue = (EditText) findViewById(R.id.AddActivityEmailValue);
                EditText addActivityDescriptionValue = (EditText) findViewById(R.id.AddActivityDescriptionValue);
                EditText addActivityPriceValue = (EditText) findViewById(R.id.AddActivityPriceValue);

                getIntent().putExtra(DataType, addActivityTypeValue.getSelectedItemPosition());
                getIntent().putExtra(DataPhone, addActivityPhoneValue.getText().toString());
                getIntent().putExtra(DataEmail, addActivityEmailValue.getText().toString());
                getIntent().putExtra(DataDescription, addActivityDescriptionValue.getText().toString());
                getIntent().putExtra(DataPrice, addActivityPriceValue.getText().toString());

                if (getParent() == null) {
                    setResult(AddActivity.RESULT_OK, getIntent());
                } else {
                    getParent().setResult(AddActivity.RESULT_OK, getIntent());
                }

                finish();
            }
        });
	}
}
