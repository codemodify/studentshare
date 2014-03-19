package com.fourty6et2.studentshare.fragments.chat;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.app.ListFragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;

import com.fourty6et2.studentshare.R;
import com.fourty6et2.studentshare.StudentShareApi;
import com.fourty6et2.studentshare.models.Chat;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.apache.http.Header;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class ChatMessagesFragment extends ListFragment {

    private ChatMessagesArrayAdapter adapter;

    private boolean canFetch;

    private void setMessages(ArrayList<Chat> messages) {
        adapter.clear();
        adapter.addAll(messages);

        getListView().post(new Runnable() {
            @Override
            public void run() {
                getListView().setSelection(getListView().getCount() - 1);
            }
        });
    }

    private void scheduleReload() {
        handler.sendEmptyMessageDelayed(0, 1000);
    }

    private void setupDefaultData() {
        ArrayList<Chat> messages = new ArrayList<Chat>();
        messages.add(new Chat("default", "default", "default"));
        messages.add(new Chat("nicu", "2pm", getString(R.string.LoremIpsumShort)));
        messages.add(new Chat("nicu", "3pm", getString(R.string.LoremIpsum)));
        messages.add(new Chat("nicu", "4pm", getString(R.string.LoremIpsumShort)));
        messages.add(new Chat("nicu", "5pm", getString(R.string.LoremIpsum)));
        messages.add(new Chat("nicu", "6pm", getString(R.string.LoremIpsumShort)));
        messages.add(new Chat("nicu", "7pm", getString(R.string.LoremIpsum)));
        messages.add(new Chat("nicu", "8pm", getString(R.string.LoremIpsumShort)));
        messages.add(new Chat("nicu", "9pm", getString(R.string.LoremIpsum)));
        messages.add(new Chat("nicu", "0pm", getString(R.string.LoremIpsumShort)));

        setMessages(messages);
    }

    @Override
    public void onResume() {
        super.onResume();

        synchronized (adapter) {
            canFetch = true;
        }

        scheduleReload();
    }

    @Override
    public void onPause() {
        super.onResume();

        synchronized (adapter) {
            canFetch = false;
        }
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        adapter = new ChatMessagesArrayAdapter(new ArrayList<Chat>());
        setListAdapter(adapter);

        view.setBackgroundColor(Color.WHITE); // Color.rgb(230, 230, 230)
        ListView listView = getListView();
        listView.setDivider(new ColorDrawable(Color.WHITE));
        listView.setDividerHeight(10); // 3 pixels height
    }

    public void reloadData() {
        //setListShown(false);

        StudentShareApi.ChatGetMessages(StudentShareApi.EmptyId, StudentShareApi.EmptyId, new JsonHttpResponseHandler() {

            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                if (!isVisible()) {
                    return;
                }

                try {
                    ArrayList<Chat> messages = new ArrayList<Chat>();

                    for (int i = 0; i < response.length(); i++) {
                        JSONObject object = (JSONObject) response.get(i);
                        String ownerId = object.getString("OwnerId");
                        String when = object.getString("When");
                        String message = object.getString("Message");

                        messages.add(new Chat(ownerId, when, message));
                    }

                    setMessages(messages);
                } catch (JSONException e) {
                    setupDefaultData();
                }

                //setListShown(true);
                scheduleReload();
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                if (!isVisible()) {
                    return;
                }

                setupDefaultData();
                //setListShown(true);
                scheduleReload();
            }
        });
    }

    private class ChatMessagesArrayAdapter extends ArrayAdapter<Chat> {

        public ChatMessagesArrayAdapter(ArrayList<Chat> chats) {
            super(getActivity(), android.R.layout.simple_list_item_1, chats);
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {

            if (null == convertView) {
                convertView = getActivity().getLayoutInflater()
                        .inflate(R.layout.fragment_chat_item, null);
            }

            LinearLayout layout = (LinearLayout) convertView.findViewById(R.id.HeaderColor);
            if (position % 2 != 0) {
                layout.setBackgroundColor(Color.rgb(118, 160, 232)); // Color.parseColor("#76A0E8")
            }
            else {
                layout.setBackgroundColor(Color.rgb(168, 26, 74)); // Color.parseColor("#A81A4A")
            }

            Chat chat = getItem(position);

            TextView
                ownerId = (TextView)convertView.findViewById(R.id.ChatOwnerId);
                ownerId.setText(chat.OwnerId);

            TextView
                when = (TextView)convertView.findViewById(R.id.ChatWhen);
                when.setText(chat.When);

            TextView
                message = (TextView)convertView.findViewById(R.id.ChatMessage);
                message.setText(chat.Message);

            return convertView;
        }
    }

    private final Handler handler = new Handler() {
        public void handleMessage(Message message) {
            synchronized (adapter) {
                if (canFetch)
                    reloadData();
            }
        }
    };
}
