package com.our.websocket.entity;

import java.util.ArrayList;

import com.our.websocket.models.CircleModel;
import com.our.websocket.models.Model;
import com.our.websocket.models.RectModel;
import com.our.websocket.util.OBJLoader;

public class VertexGenerator {
	private static final String fileName = "C:\\Users\\TK\\Desktop\\temp\\DataFlowImpl_1\\res\\Buildings.txt";
	
	public static ArrayList<Vertex> createRandomVertices(){
		ArrayList<Vertex> vertices = new ArrayList<Vertex>();
		
		ArrayList<Model> models = OBJLoader.loadObjModel(fileName);
		for(int i = 0;i< models.size();i++) {
			if(models.get(i) instanceof CircleModel) continue;
			
			
			ArrayList<Vertex> localVertices = models.get(i).generateRandomeLocations();
			
			if(localVertices != null) vertices.addAll(localVertices);
		}
		
		return vertices;
	}
	
	
//	private static final int personNum = 200 + 1;
//	
//	public static ArrayList<Person> createRandomPersons(){
//		ArrayList<Person> list = new ArrayList<Person>(personNum);
//		
//		for (int i = 0; i < personNum - 1; i++) {
//			Person person = createRandomPerson();
//			person.setName("Person_" + i);
//			list.add(i,person);
//		}
//		
//		
//		return list;
//	}
//	
//	private static Person createRandomPerson() {
//		return new Person(Math.random() * 0.28 + 39.78, Math.random() * 0.5 + 116.12, Math.random() * 80);
//	}
}
