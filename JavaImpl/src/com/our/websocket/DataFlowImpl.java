package com.our.websocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import com.our.websocket.entity.DoubleStringPair;
import com.our.websocket.entity.Vertex;
import com.our.websocket.entity.Person;
import com.our.websocket.entity.VertexGenerator;
import com.our.websocket.message.ControlMessage;
import com.our.websocket.message.Message;
import com.our.websocket.message.PositionMessage;
import com.our.websocket.util.Log;
import com.our.websocket.util.MathUtil;

@ServerEndpoint(value = "/dataflowimpl", encoders = {MessageEncoder.class}, decoders = {MessageDecoder.class})
public class DataFlowImpl {
	static Set<Session> users = Collections.synchronizedSet(new HashSet<Session>());
	
	private ArrayList<Person> persons = new ArrayList<>();
	
	private static void initLogMsg() {
		Log.setLogMsgHeaders("OBJLoader", "From class OBJLoader: ");
		Log.setLogMsgHeaders("DataFlowImpl", "From class DataFlowImpl: ");
	}
	
	private void init() {
		initLogMsg();
		
		ArrayList<Vertex> vertices = VertexGenerator.createRandomVertices();
		
		for(Vertex v:vertices) {
			persons.add(new Person(v));
		}
	}
	
	@OnOpen
	public void handleOpen(Session userSession) throws IOException, EncodeException{
		init();
		
		Log.log("DataFlowImpl", "Client is now connected...");
		users.add(userSession);
		sendToClient(userSession);
	}
	
	@OnMessage
	public void handleMessage(Message incomingMessage,Session userSession) throws IOException, EncodeException{
		if(incomingMessage instanceof ControlMessage) {
			ControlMessage controlMsg = (ControlMessage)incomingMessage;
			
			if(controlMsg.getIsNeedPosData().equals("yes")) {
//				System.out.println("Received request");
//				update();
//				sendToClient(userSession);
			}else if(controlMsg.getIsNeedPosData().equals("no")) {
//				System.out.println(controlMsg.getPathPoints());
//				calcPath(controlMsg);
			}
		}
	}
	
	@OnClose
	public void handleClose(Session userSession) {
		Log.log("DataFlowImpl", "Client is now disconnected...");
		users.remove(userSession);
	}
	
	@OnError
	public void handleError(Throwable t) {
		t.printStackTrace();
	}
	
	private void sendToClient(Session userSession) throws IOException, EncodeException{
		PositionMessage posMsg = new PositionMessage(persons);
		userSession.getBasicRemote().sendObject(posMsg);
	}
	
//	private void update() {
//		for(int i=0;i<persons.size();i++) {
//			persons.get(i).update();
//		}
//	}
//	
//	//TODO: Wrong path
//	private void calcPath(ControlMessage controlMsg) {
//		for(int i=0;i<persons.size();i++) {
//			persons.get(i).setMovePath(getClosetPoint(persons.get(i),controlMsg.getPathPoints()), controlMsg.getPathPoints());
//			
//		}
//	}
//	
//	private DoubleStringPair getClosetPoint(Person person, ArrayList<DoubleStringPair> wholePath) {
//		DoubleStringPair result = wholePath.get(0);
//		
//		double posX =  Double.parseDouble(wholePath.get(0).getX());
//		double posY =  Double.parseDouble(wholePath.get(0).getY());
//		
//		double closetDistance  = MathUtil.distance(posX,posY,person.getLongitude(),person.getLatitude());
//		
//		for(int i=0;i<wholePath.size();i++) {
//			posX =  Double.parseDouble(wholePath.get(i).getX());
//			posY =  Double.parseDouble(wholePath.get(i).getY());
//			
//			double d  = MathUtil.distance(posX,posY,person.getLongitude(),person.getLatitude());
//			
//			if(d < closetDistance) {
//				result = wholePath.get(i);
//				closetDistance = d;
//			}
//			
//		}
//		
//		return result;
//	}
}
