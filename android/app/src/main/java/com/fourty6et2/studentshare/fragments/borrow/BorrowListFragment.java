package com.fourty6et2.studentshare.fragments.borrow;

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
import com.loopj.android.http.JsonHttpResponseHandler;

import org.apache.http.Header;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class BorrowListFragment extends ListFragment {

    private BorrowListArrayAdapter adapter;

    private void setupDefaultData() {
        ArrayList<Borrow> borrows = new ArrayList<Borrow>();
        borrows.add(new Borrow("0000-1111", "default  ", "defa", "default    ", "default                  ", "default       ", "defa", 0));
        borrows.add(new Borrow("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "borrow my bike", "$340", 0));
        borrows.add(new Borrow("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "borrow my bike", "$340", 0));
        borrows.add(new Borrow("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "borrow my bike", "$340", 0));
        borrows.add(new Borrow("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "borrow my bike", "$340", 0));
        borrows.add(new Borrow("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "borrow my bike", "$340", 0));
        borrows.add(new Borrow("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "borrow my bike", "$340", 0));
        borrows.add(new Borrow("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "borrow my bike", "$340", 0));
        borrows.add(new Borrow("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "borrow my bike", "$340", 0));
        borrows.add(new Borrow("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "borrow my bike", "$340", 0));
        borrows.add(new Borrow("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "borrow my bike", "$340", 0));
        borrows.add(new Borrow("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "borrow my bike", "$340", 0));
        borrows.add(new Borrow("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "borrow my bike", "$340", 0));
        borrows.add(new Borrow("0000-1111", "0000-1111", "bike", "987 987 987", "nicolae.carabut@gmail.com", "borrow my bike", "$340", 0));

        adapter.clear();
        adapter.addAll(borrows);
        adapter.notifyDataSetChanged();
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        adapter = new BorrowListArrayAdapter(new ArrayList<Borrow>());
        setListAdapter(adapter);

        if (savedInstanceState == null) {
            reloadData();
        }
    }

    public void reloadData() {
        setListShown(false);

        StudentShareApi.LoadBorrow(Config.getUserId(), new JsonHttpResponseHandler() {

            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                if (!isVisible()) {
                    return;
                }

                try {
                    ArrayList<Borrow> borrows = new ArrayList<Borrow>();

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

                        borrows.add(new Borrow(id, ownerId, type, phone, email, description, price, Integer.parseInt(wantCount)));
                    }

                    adapter.clear();
                    adapter.addAll(borrows);
                    adapter.notifyDataSetChanged();
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

    private class BorrowListArrayAdapter extends ArrayAdapter<Borrow> {

        public BorrowListArrayAdapter(ArrayList<Borrow> chats) {
            super(getActivity(), android.R.layout.simple_list_item_1, chats);
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {

            if (null == convertView) {
                convertView = getActivity().getLayoutInflater().inflate(R.layout.fragment_borrow_item, null);
            }

            Borrow borrow = getItem(position);

            ImageView
                type = (ImageView)convertView.findViewById(R.id.BorrowType);
                type.setImageResource(Helpers.getDrawableIdByType(borrow.Type));

            TextView
                wantCount = (TextView)convertView.findViewById(R.id.BorrowWantCount);
                wantCount.setText(String.format("%d people want this.", borrow.WantCount));

            TextView
                description = (TextView)convertView.findViewById(R.id.BorrowDescription);
                description.setText(borrow.Description);

            TextView
                phone = (TextView)convertView.findViewById(R.id.BorrowPhone);
                phone.setText(borrow.Phone);

            TextView
                email = (TextView)convertView.findViewById(R.id.BorrowEmail);
                email.setText(borrow.Email);

            TextView
                price = (TextView)convertView.findViewById(R.id.BorrowPrice);
                price.setText(borrow.Price);

            return convertView;
        }
    }
}