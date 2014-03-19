package com.fourty6et2.studentshare.models;

public class Borrow {
    public String Id;
    public String OwnerId;
    public String Type;
    public String Phone;
    public String Email;
    public String Description;
    public String Price;
    public int WantCount;

    public Borrow(String id,
                  String ownerId,
                  String type,
                  String phone,
                  String email,
                  String description,
                  String price,
                  int wantCount) {
        Id = id;
        OwnerId = ownerId;
        Type = type;
        Phone = phone;
        Email = email;
        Description = description;
        Price = price;
        WantCount = wantCount;
    }
}
