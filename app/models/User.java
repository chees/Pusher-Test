package models;

import java.util.UUID;

public class User {
    public String uuid;
    
    public User() {
    	uuid = UUID.randomUUID().toString();
    }
}
