package com.our.websocket.models;

import java.util.ArrayList;

import com.our.websocket.entity.Vertex;

public class CircleModel extends Model{
	private final int personNum = 100 + 1;
	private Vertex center;
	private double radius;
	
	public void setCenter(Vertex center) {this.center = center;}
	public void setRadius(double radius) {this.radius = radius;}
	
	public Vertex getCenter() {return center;}
	public double getRadius() {return radius;}
	
	
	@Override
	public ArrayList<Vertex> generateRandomeLocations() {
		//ESPG4326:£¨Lat£¬Long£©=£¨x,y)
		ArrayList<Vertex> vertices = new ArrayList<Vertex>();
		for(int i=0;i < personNum-1;i++) {
			vertices.add(createP());
			vertices.get(i).setName("PersonLoc_" + i);
		}
		return vertices;
	}
	
	public Vertex createP() {
		double Lat = center.getLatitude();
		double Long = center.getLongitude();
		Vertex vertex = new Vertex(Math.random()*radius+Lat, Math.random()*radius+Long);
		return vertex;
	}
}
