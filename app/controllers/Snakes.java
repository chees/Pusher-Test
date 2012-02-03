package controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import play.libs.F.Promise;
import play.libs.WS;
import play.libs.WS.HttpResponse;
import play.libs.WS.WSRequest;
import play.mvc.Controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;

public class Snakes extends Controller {

    public static void index() {
    	render();
    }

    public static void view() {
    	String room = UUID.randomUUID().toString();
        render(room);
    }
    
    public static void join(String room) {
    	render(room);
    }
    
    public static String shortUrl(String url) throws Exception {
    	WSRequest req = WS.url("https://www.googleapis.com/urlshortener/v1/url");
    	req.setHeader("Content-Type", "application/json");
    	
    	Map<String, String> body = new HashMap();
    	body.put("longUrl", url);
    	Gson gson = new Gson();
    	req.body(gson.toJson(body));
    	
    	Promise<HttpResponse> res = req.postAsync();
    	JsonElement json = res.get().getJson();
    	String shortUrl = json.getAsJsonObject().get("id").getAsString();
    	
    	response.setContentTypeIfNotSet("text/javascript");
    	String output = "var shortUrl = '" + shortUrl + "';";
    	output += "document.getElementById('join').href = shortUrl;";
    	output += "document.getElementById('join').innerHTML = shortUrl;";
    	return output;
    }
}
