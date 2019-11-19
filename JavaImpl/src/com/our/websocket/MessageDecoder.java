package com.our.websocket;

import java.io.StringReader;
import java.util.ArrayList;

import javax.json.Json;
import javax.json.JsonObject;
import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

import com.our.websocket.entity.DoubleStringPair;
import com.our.websocket.message.ControlMessage;
import com.our.websocket.message.Message;;

public class MessageDecoder implements Decoder.Text<Message> {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public void init(EndpointConfig arg0) {
		// TODO Auto-generated method stub

	}

	@Override
	public Message decode(String jsonMsg) throws DecodeException {
		ControlMessage controlMsg = new ControlMessage();
		JsonObject jsonObject = Json.createReader(new StringReader(jsonMsg)).readObject();
		controlMsg.setIsNeedPosData(jsonObject.getString("isNeedPosData"));
		if(controlMsg.getIsNeedPosData().equals("no")) {			
			controlMsg.setPathPoints(parseLngLatMsg(jsonObject.getString("longitudes"),jsonObject.getString("latitudes")));
		}
		
		return controlMsg;
	}

	@Override
	public boolean willDecode(String s) {
		boolean flag = true;
		try {Json.createReader(new StringReader(s)).readObject();}
		catch(Exception e) {flag = false;}
		
		return flag;
	}
	
	private ArrayList<DoubleStringPair> parseLngLatMsg(String lngMsg, String latMsg) {
		String[] sptLngString = lngMsg.split("\\s+");
		String[] sptLatString = latMsg.split("\\s+");
		
		final int len = sptLngString.length;
		
		ArrayList<DoubleStringPair> result = new ArrayList<DoubleStringPair>(len);
		for(int i=0;i<len;i++) {
			result.add(new DoubleStringPair(sptLngString[i], sptLatString[i]));
		}
		
		return result;
	}

}
