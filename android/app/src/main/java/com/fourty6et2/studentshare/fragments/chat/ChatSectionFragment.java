package com.fourty6et2.studentshare.fragments.chat;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.fourty6et2.studentshare.Config;
import com.fourty6et2.studentshare.Helpers;
import com.fourty6et2.studentshare.R;
import com.fourty6et2.studentshare.StudentShareApi;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.apache.http.Header;
import org.json.JSONArray;
import org.json.JSONObject;

public class ChatSectionFragment extends Fragment {

    private static final String ChatMessagesTag = "ChatMessagesTag";

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        View rootView = inflater.inflate(R.layout.fragment_chat, container, false);

        ChatMessagesFragment fragment = new ChatMessagesFragment();
        getChildFragmentManager()
            .beginTransaction()
            .add(R.id.ChatMessagesContainer, fragment, ChatMessagesTag)
            .commit();

        Button sendChat = (Button) rootView.findViewById(R.id.SendChatButton);
        sendChat.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if (!Config.Authenticate(getActivity()))
                    return;

                EditText newChatMessageEditText = (EditText) getView().findViewById(R.id.NewChatMessageEditText);

                StudentShareApi.ChatSendMessage(Config.User.Id, newChatMessageEditText.getText().toString(), new JsonHttpResponseHandler() {
                    @Override
                    public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
//                        reloadData();
                    }

                    @Override
                    public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
//                        reloadData();
                    }

                    @Override
                    public void onSuccess(int statusCode, Header[] headers, String responseString) {
//                        reloadData();
                    }

                    @Override
                    public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                        if (statusCode != 200) {
                            Helpers.showNotificationBubble(R.string.ChatSectionFailedToSendMessage, getActivity());
                        } else {
//                            reloadData();
                        }
                    }
                });

                newChatMessageEditText.setText("");
            }
        });

        return rootView;
    }

//    private void reloadData() {
//        ChatMessagesFragment fragment = (ChatMessagesFragment) getChildFragmentManager().findFragmentByTag(ChatMessagesTag);
//        if (fragment != null)
//            fragment.reloadData();
//
//        EditText editText = (EditText) getView().findViewById(R.id.NewChatMessageEditText);
//        editText.setText("");
//    }

//    @Override
//    public void setUserVisibleHint(boolean isVisibleToUser) {
//        super.setUserVisibleHint(isVisibleToUser);
//
//        if (isVisibleToUser) {
//            reloadData();
//        }
//    }
}
