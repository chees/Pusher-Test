package controllers;

import play.modules.pusher.BasicUserInfo;
import play.modules.pusher.PresenceChannelData;
import play.modules.pusher.Pusher;
import play.mvc.Controller;

public class PusherController extends Controller {

	private static int userId = 0;
	
    public static void auth(String socket_id, String channel_name) {
    	userId++;
    	Pusher pusher = new Pusher();
    	BasicUserInfo userInfo = new BasicUserInfo();
    	userInfo.setName("User " + userId);
    	PresenceChannelData channelData = new PresenceChannelData(""+userId, userInfo);
    	renderJSON(pusher.createAuthString(socket_id, channel_name, channelData));
    }

}
