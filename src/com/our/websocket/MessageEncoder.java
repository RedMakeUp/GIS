package com.our.websocket;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

import java.util.ArrayList;
import java.util.Iterator;

import javax.json.*;

import com.our.websocket.entity.Vertex;
import com.our.websocket.message.Message;
import com.our.websocket.message.PositionMessage;;

public class MessageEncoder implements Encoder.Text<Message> {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public void init(EndpointConfig arg0) {
		// TODO Auto-generated method stub

	}

	@Override
	public String encode(Message jsonMsg) throws EncodeException {
		String result = null;
		
		if(jsonMsg instanceof PositionMessage) {
			PositionMessage msg = (PositionMessage)jsonMsg;
			result = buildJsonPositionData(msg.getVertices());
		}
		
		return result; 
	}
	
	private String buildJsonPositionData(ArrayList<Vertex> persons) {
		Iterator<Vertex> it = persons.iterator();
		JsonArrayBuilder jsonArrayBuilder_lon = Json.createArrayBuilder();
		JsonArrayBuilder jsonArrayBuilder_lat = Json.createArrayBuilder();
		JsonArrayBuilder jsonArrayBuilder_int = Json.createArrayBuilder();
		
		while(it.hasNext()) {
			Vertex vertex = it.next();
			
			jsonArrayBuilder_lon.add(vertex.getLongitude());
			jsonArrayBuilder_lat.add(vertex.getLatitude());
			jsonArrayBuilder_int.add(vertex.getIntensity());
		}
		
		return Json.createObjectBuilder().add("longitudes", jsonArrayBuilder_lon)
								         .add("latitudes", jsonArrayBuilder_lat)
								         .add("intensities", jsonArrayBuilder_int)
								         .build().toString();
	}

}
