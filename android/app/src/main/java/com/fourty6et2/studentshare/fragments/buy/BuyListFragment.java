package com.fourty6et2.studentshare.fragments.buy;

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
import com.fourty6et2.studentshare.models.Search;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.apache.http.Header;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class BuyListFragment extends ListFragment {

    private BuyListArrayAdapter adapter;

    private void setupDefaultData() {
        ArrayList<Search> searches = new ArrayList<Search>();
        searches.add(new Search("0000-1111", "default  ", "defa", "default    ", "default                  ", "default    ", "defa", 0));
        searches.add(new Search("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "buy my bike", "$340", 0));
        searches.add(new Search("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "buy my bike", "$340", 0));
        searches.add(new Search("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "buy my bike", "$340", 0));
        searches.add(new Search("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "buy my bike", "$340", 0));
        searches.add(new Search("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "buy my bike", "$340", 0));
        searches.add(new Search("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "buy my bike", "$340", 0));
        searches.add(new Search("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "buy my bike", "$340", 0));
        searches.add(new Search("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "buy my bike", "$340", 0));
        searches.add(new Search("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "buy my bike", "$340", 0));
        searches.add(new Search("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "buy my bike", "$340", 0));
        searches.add(new Search("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "buy my bike", "$340", 0));
        searches.add(new Search("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "buy my bike", "$340", 0));
        searches.add(new Search("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "buy my bike", "$340", 0));

        adapter.clear();
        adapter.addAll(searches);
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        adapter = new BuyListArrayAdapter(new ArrayList<Search>());
        setListAdapter(adapter);

        if (savedInstanceState == null) {
            reloadData();
        }
    }

    public void reloadData() {
        setListShown(false);

        StudentShareApi.LoadSearch(Config.getUserId(), new JsonHttpResponseHandler() {

            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                if (!isVisible()) {
                    return;
                }

                try {
                    ArrayList<Search> borrows = new ArrayList<Search>();

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

                        borrows.add(new Search(id, ownerId, type, phone, email, description, price, Integer.parseInt(wantCount)));
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

    private class BuyListArrayAdapter extends ArrayAdapter<Search> {

        public BuyListArrayAdapter(ArrayList<Search> chats) {
            super(getActivity(), android.R.layout.simple_list_item_1, chats);
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {

            if (null == convertView) {
                convertView = getActivity().getLayoutInflater().inflate(R.layout.fragment_buy_item, null);
            }

            Search search = getItem(position);

            ImageView
                type = (ImageView)convertView.findViewById(R.id.SearchType);
                type.setImageResource(Helpers.getDrawableIdByType(search.Type));

            TextView
                wantCount = (TextView)convertView.findViewById(R.id.SearchWantCount);
                wantCount.setText(String.format("%d people want this.", search.WantCount));

            TextView
                description = (TextView)convertView.findViewById(R.id.SearchDescription);
                description.setText(search.Description);

            TextView
                phone = (TextView)convertView.findViewById(R.id.SearchPhone);
                phone.setText(search.Phone);

            TextView
                email = (TextView)convertView.findViewById(R.id.SearchEmail);
                email.setText(search.Email);

            TextView
                price = (TextView)convertView.findViewById(R.id.SearchPrice);
                price.setText(search.Price);

            return convertView;
        }
    }
}