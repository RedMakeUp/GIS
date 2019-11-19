package com.our.websocket.message;

import java.util.ArrayList;

import com.our.websocket.entity.Person;
import com.our.websocket.entity.Vertex;

public class PositionMessage implements Message {
	private ArrayList<Vertex> vertices = null;
	
	public PositionMessage(ArrayList<Person> persons) {
		vertices = new ArrayList<Vertex>();
		
		for(Person person:persons) {
			vertices.add(person.getLocation());
		}
	}
	
	public ArrayList<Vertex> getVertices(){
		return vertices;
	}
}
