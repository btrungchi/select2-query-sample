package app;

import static spark.Spark.*;
import spark.Request;
import spark.Response;
import spark.Route;
import java.nio.file.Paths;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import au.com.bytecode.opencsv.CSVReader;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import org.apache.log4j.Logger;
import org.apache.log4j.LogManager;

/**
 * Main class
 *
 */
public class App 
{
    public static final String STATIC_PATH = "/public";
    public static final String ROUTE_GETDATA = "/get-data";
    public static Logger logger = LogManager.getLogger(App.class);

    public static Route getDataPostAction = (Request request, Response response) -> {
        JsonArray arrReturnData = new JsonArray();

        // Get query data
        String csvUrl = request.queryParams("url");
        System.out.println(csvUrl);
        if (csvUrl == null) {
            logger.info("csvUrl == null");
            return Utils.sendJsonContent(request, response, new JsonObject());
        }

        try {
            URL stockURL = new URL(csvUrl);
            BufferedReader in = new BufferedReader(new InputStreamReader(stockURL.openStream()));
            CSVReader reader = new CSVReader(in);
            String [] header = reader.readNext();
            
            String [] row;            
            while ((row = reader.readNext()) != null) {
                JsonObject oJsonObject = new JsonObject(); 
                for(int i = 0; i < header.length; i++) {
                    oJsonObject.addProperty(header[i], row[i]);
                }
                arrReturnData.add(oJsonObject);
            }

            reader.close();
        } catch (Exception ex) {
            ex.printStackTrace();
            logger.info(ex.getMessage(), ex);
            return Utils.sendJsonContent(request, response, new JsonObject());
        }

        return Utils.sendJsonContent(request, response, arrReturnData);
    };

    public static void main( String[] args )
    {   
        String currDirectory = Paths.get(".").toAbsolutePath().normalize().toString();

        externalStaticFileLocation(currDirectory + App.STATIC_PATH);
        setIpAddress("localhost");
        setPort(8080);        

        post(App.ROUTE_GETDATA, App.getDataPostAction);
    }    
}
