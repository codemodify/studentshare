package com.fourty6et2.studentshare.fragments.sell;

import android.os.Bundle;
import android.support.v4.app.ListFragment;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.fourty6et2.studentshare.Config;
import com.fourty6et2.studentshare.Helpers;
import com.fourty6et2.studentshare.R;
import com.fourty6et2.studentshare.StudentShareApi;
import com.fourty6et2.studentshare.models.Borrow;
import com.fourty6et2.studentshare.models.Sell;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.apache.http.Header;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class SellListFragment extends ListFragment {

    private SellListArrayAdapter adapter;

    private void setupDefaultData() {
        ArrayList<Sell> sells = new ArrayList<Sell>();
        sells.add(new Sell("0000-1111", "default  ", "defa", "default    ", "default                  ", "default        ", "defa", 0));
        sells.add(new Sell("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "selling my bike", "$340", 0));
        sells.add(new Sell("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "selling my bike", "$340", 0));
        sells.add(new Sell("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "selling my bike", "$340", 0));
        sells.add(new Sell("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "selling my bike", "$340", 0));
        sells.add(new Sell("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "selling my bike", "$340", 0));
        sells.add(new Sell("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "selling my bike", "$340", 0));
        sells.add(new Sell("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "selling my bike", "$340", 0));
        sells.add(new Sell("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "selling my bike", "$340", 0));
        sells.add(new Sell("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "selling my bike", "$340", 0));
        sells.add(new Sell("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "selling my bike", "$340", 0));
        sells.add(new Sell("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "selling my bike", "$340", 0));
        sells.add(new Sell("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "selling my bike", "$340", 0));
        sells.add(new Sell("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "selling my bike", "$340", 0));

        adapter.clear();
        adapter.addAll(sells);
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        adapter = new SellListArrayAdapter(new ArrayList<Sell>());
        setListAdapter(adapter);

        if (savedInstanceState == null) {
            reloadData();
        }
    }

    public void reloadData() {
        setListShown(false);

        StudentShareApi.LoadSell(Config.getUserId(), new JsonHttpResponseHandler() {

            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                if (!isVisible()) {
                    return;
                }

                try {
                    ArrayList<Sell> borrows = new ArrayList<Sell>();

                    for (int i = 0; i < response.length(); i++) {
                        JSONObject object = (JSONObject) response.get(i);
                        String id = object.getString("Id");
                        String ownerId = object.getString("OwnerId");
                        String type = object.getString("Type");
                        String phone = object.getString("Phone");
                        String email = object.getString("Email");
                        String description = object.getString("Description");
                        String price = object.getString("Price");
                        String wantCount = object.getString("WantCount");

                        borrows.add(new Sell(id, ownerId, type, phone, email, description, price, Integer.parseInt(wantCount)));
                    }

                    adapter.clear();
                    adapter.addAll(borrows);
                } catch (JSONException e) {
                    setupDefaultData();
                }

                setListShown(true);
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                if (!isVisible()) {
                    return;
                }

                setupDefaultData();
                setListShown(true);
            }
        });
    }

    private class SellListArrayAdapter extends ArrayAdapter<Sell> {

        public SellListArrayAdapter(ArrayList<Sell> sells) {
            super(getActivity(), android.R.layout.simple_list_item_1, sells);
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {

            if (null == convertView) {
                convertView = getActivity().getLayoutInflater().inflate(R.layout.fragment_sell_item, null);
            }

            Sell sell = getItem(position);

            ImageView
                type = (ImageView)convertView.findViewById(R.id.SellType);
                type.setImageResource(Helpers.getDrawableIdByType(sell.Type));

            TextView
                wantCount = (TextView)convertView.findViewById(R.id.SellWantCount);
                wantCount.setText(String.format("%d people want this.", sell.WantCount));

            TextView
                description = (TextView)convertView.findViewById(R.id.SellDescription);
                description.setText(sell.Description);

            TextView
                phone = (TextView)convertView.findViewById(R.id.SellPhone);
                phone.setText(sell.Phone);

            TextView
                email = (TextView)convertView.findViewById(R.id.SellEmail);
                email.setText(sell.Email);

            TextView
                price = (TextView)convertView.findViewById(R.id.SellPrice);
                price.setText(sell.Price);

            return convertView;
        }
    }
}