package app;
import spark.Request;
import spark.Response;
import com.google.gson.Gson;

public class Utils {
    public static String sendJsonContent(Request request, Response response, Object model) {
        String jsonData = new Gson().toJson(model);
        response.header("Content-Type", "application/json");        
        return jsonData;
    }
}
