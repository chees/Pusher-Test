package controllers;

import models.User;
import play.modules.pusher.PresenceChannelData;
import play.modules.pusher.Pusher;
import play.mvc.Controller;

public class PusherController extends Controller {
	
    public static void auth(String socket_id, String channel_name) {
    	Pusher pusher = new Pusher();
    	User user = new User();
    	PresenceChannelData channelData = new PresenceChannelData(user.uuid, null);
    	renderJSON(pusher.createAuthString(socket_id, channel_name, channelData));
    }

}
