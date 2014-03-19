package com.fourty6et2.studentshare;

import android.util.Base64;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public class StudentShareApi {

	private static final AsyncHttpClient _asyncHttpClient = new AsyncHttpClient();
	private static final String _baseUrl = "http://mumstudentshare.herokuapp.com/";
//    private static final String _baseUrl = "http://127.0.0.1:8080/";

    public static final String EmptyId = "00000000-0000-0000-0000-000000000000";

	class Api {
	    public static final String RegisterUser                	= "RegisterUser/%s/%s/%s"           ; // "RegisterUser/:Name/:Pass/:DeviceRegistrationId""
	    public static final String LoginUser                   	= "LoginUser/%s/%s/%s"              ; // "LoginUser/:Name/:Pass/:DeviceRegistrationId"
	    public static final String UpdateUserProfile           	= "UpdateUserProfile/%s/%s"         ; // "UpdateUserProfile/:UserId/:Email"                 
	    
	    public static final String ChatSendMessage             	= "ChatSendMessage/%s/%s"           ; // "ChatSendMessage/:UserId/:Message"                 
	    public static final String ChatGetMessages             	= "ChatGetMessages/%s/%s"           ; // "ChatGetMessages/:UserId/:LastMessageId"           
	    
	    public static final String AddBorrow                   	= "AddBorrow/%s/%s/%s/%s/%s/%s"     ; // "AddBorrow/:UserId/:Type/:Phone/:Email/:Description/:Price"
	    public static final String AddSell                     	= "AddSell/%s/%s/%s/%s/%s/%s"       ; // "AddSell/:UserId/:Type/:Phone/:Email/:Description/:Price" 
	    public static final String AddSearch                   	= "AddSearch/%s/%s/%s/%s/%s/%s"     ; // "AddSearch/:UserId/:Type/:Phone/:Email/:Description/:Price" 
	                                                                                                
	    public static final String RemoveBorrow                	= "RemoveBorrow/%s/%s"              ; // "RemoveBorrow/:ItemId/:OwnerId"                  
	    public static final String RemoveSell                  	= "RemoveSell/%s/%s"                ; // "RemoveSell/:ItemId/:OwnerId"                  
	    public static final String RemoveSearch                	= "RemoveSearch/%s/%s"              ; // "RemoveSearch/:ItemId/:OwnerId"                  
	                                                                                                
	    public static final String LoadSell                   	= "LoadSell/%s"                     ; // "LoadSell/:UserId"                         
	    public static final String LoadSearch                  	= "LoadSearch/%s"                   ; // "LoadSearch/:UserId"                       
	    public static final String LoadBorrow                  	= "LoadBorrow/%s"                   ; // "LoadBorrow/:UserId"                       
	                                                                                                
	    public static final String WantBorrow                  	= "WantBorrow/%s/%s"                ; // "WantBorrow/:ItemId/:UserId"                   
	    public static final String WantSell                    	= "WantSell/%s/%s"                  ; // "WantSell/:ItemId/:UserId"                 
	    public static final String WantSearch                  	= "WantSearch/%s/%s"                ; // "WantSearch/:ItemId/:UserId"                   
	                                                                                                
	    public static final String GetInterestedUsers          	= "GetInterestedUsers/%s"           ; // "GetInterestedUsers/:UserId"                       
	    public static final String GetInterestedUsersToBorrow	= "GetInterestedUsersToBorrow/%s"	; // "GetInterestedUsersToBorrow/:ItemId"                       
	    public static final String GetInterestedUsersToSell    	= "GetInterestedUsersToSell/%s"     ; // "GetInterestedUsersToSell/:ItemId"                         
	    public static final String GetInterestedUsersToSearch  	= "GetInterestedUsersToSearch/%s"   ; // "GetInterestedUsersToSearch/:ItemId"

        public static final String SaveDeviceRegistrationId     = "SaveDeviceRegistrationId/%s"     ; // "SaveDeviceRegistrationId/:DeviceRegistrationId"
	}

    // User
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    public static void RegisterUser(String name, String password, String deviceRegistrationId, AsyncHttpResponseHandler responseHandler) {
        _asyncHttpClient.get(_baseUrl+String.format(Api.RegisterUser, name, password, deviceRegistrationId), responseHandler);
    }

    public static void LoginUser(String name, String password, String deviceRegistrationId, AsyncHttpResponseHandler responseHandler) {
        _asyncHttpClient.get(_baseUrl+String.format(Api.LoginUser, name, password, deviceRegistrationId), responseHandler);
    }

    public static void UpdateUserProfile(String userId, String email, AsyncHttpResponseHandler responseHandler) {
        _asyncHttpClient.get(_baseUrl+String.format(Api.UpdateUserProfile, userId, email), responseHandler);
    }

    // Chat
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
	public static void ChatSendMessage(String userId, String message, AsyncHttpResponseHandler responseHandler) {
        _asyncHttpClient.get(_baseUrl+String.format(Api.ChatSendMessage, userId, Helpers.stringToBase64(message)), responseHandler);
	}

	public static void ChatGetMessages(String userId, String lastMessageId, AsyncHttpResponseHandler responseHandler) {
		_asyncHttpClient.get(_baseUrl+String.format(Api.ChatGetMessages, userId, lastMessageId), responseHandler);
	}

    // Add
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    public static final String AddBorrow                   	= "AddBorrow/%s/%s/%s/%s/%s/%s"     ; // "AddBorrow/:UserId/:Type/:Phone/:Email/:Description/:Price"
    public static final String AddSell                     	= "AddSell/%s/%s/%s/%s/%s/%s"       ; // "AddSell/:UserId/:Type/:Phone/:Email/:Description/:Price"
    public static final String AddSearch                   	= "AddSearch/%s/%s/%s/%s/%s/%s"     ; // "AddSearch/:UserId/:Type/:Phone/:Email/:Description/:Price"

    public static void AddBorrow(String userId, String type, String phone, String email, String description, String price, AsyncHttpResponseHandler responseHandler) {
        type  = type.length() == 0 ? " " : type;
        phone = phone.length() == 0 ? " " : phone;
        email = email.length() == 0 ? " " : email;
        description = description.length() == 0 ? " " : description;
        price = price.length() == 0 ? " " : price;

        String url = _baseUrl+String.format(Api.AddBorrow, userId, Helpers.stringToBase64(type), Helpers.stringToBase64(phone), Helpers.stringToBase64(email), Helpers.stringToBase64(description), Helpers.stringToBase64(price));

        _asyncHttpClient.get(url, responseHandler);
    }

    public static void AddSell(String userId, String type, String phone, String email, String description, String price, AsyncHttpResponseHandler responseHandler) {
        type  = type.length() == 0 ? " " : type;
        phone = phone.length() == 0 ? " " : phone;
        email = email.length() == 0 ? " " : email;
        description = description.length() == 0 ? " " : description;
        price = price.length() == 0 ? " " : price;

        _asyncHttpClient.get(_baseUrl+String.format(Api.AddSell, userId, Helpers.stringToBase64(type), Helpers.stringToBase64(phone), Helpers.stringToBase64(email), Helpers.stringToBase64(description), Helpers.stringToBase64(price)), responseHandler);
    }

    public static void AddSearch(String userId, String type, String phone, String email, String description, String price, AsyncHttpResponseHandler responseHandler) {
        type  = type.length() == 0 ? " " : type;
        phone = phone.length() == 0 ? " " : phone;
        email = email.length() == 0 ? " " : email;
        description = description.length() == 0 ? " " : description;
        price = price.length() == 0 ? " " : price;

        _asyncHttpClient.get(_baseUrl+String.format(Api.AddSearch, userId, Helpers.stringToBase64(type), Helpers.stringToBase64(phone), Helpers.stringToBase64(email), Helpers.stringToBase64(description), Helpers.stringToBase64(price)), responseHandler);
    }

    // Remove
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

    // Load
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    public static void LoadSell(String userId, AsyncHttpResponseHandler responseHandler) {
        _asyncHttpClient.get(_baseUrl+String.format(Api.LoadSell, userId), responseHandler);
    }

    public static void LoadSearch(String userId, AsyncHttpResponseHandler responseHandler) {
        _asyncHttpClient.get(_baseUrl+String.format(Api.LoadSearch, userId), responseHandler);
    }

    public static void LoadBorrow(String userId, AsyncHttpResponseHandler responseHandler) {
        _asyncHttpClient.get(_baseUrl+String.format(Api.LoadBorrow, userId), responseHandler);
    }

    // Want
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

    // Get
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

    // Gsm
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    public static void SaveDeviceRegistrationId(String deviceRegistrationId, AsyncHttpResponseHandler responseHandler) {
        _asyncHttpClient.get(_baseUrl+String.format(Api.SaveDeviceRegistrationId, deviceRegistrationId), responseHandler);
//        _asyncHttpClient.get(_baseUrl+String.format(Api.SaveDeviceRegistrationId, Helpers.stringToBase64(deviceRegistrationId)), responseHandler);
    }
}
