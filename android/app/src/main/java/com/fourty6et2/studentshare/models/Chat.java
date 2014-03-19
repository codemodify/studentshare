package com.fourty6et2.studentshare.models;

public class Chat {
	public String OwnerId;
	public String When;
	public String Message;

	public Chat(String ownerId, String when, String message) {
		OwnerId = ownerId;
		When = when;
		Message = message;
	}
}
