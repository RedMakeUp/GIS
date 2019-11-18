package com.our.websocket.entity;

import java.util.ArrayList;

public class Person {
	//private static final double tolorance = 0.002;
	//private static final double speed = 0.003;
	
	private Vertex location;
	private String name;
	private ArrayList<Vertex> movePath;
	
	public Person(Vertex location) {
		this.setLocation(location);
		movePath = new ArrayList<Vertex>();
	}
	
	// Getters
	public ArrayList<Vertex> getMovePath(){
		return movePath;
	}
	public String getName() {
		return name;
	}
	public Vertex getLocation() {
		return location;
	}
	
	// Setters
	public void setName(String name) {
		this.name = name;
	}
	public void setLocation(Vertex location) {
		this.location = location;
	}
	
	
	
	
	
	
	
//	public void update() {
//		if(movePath.size() == 0) return;
//		
//		Vertex target = movePath.get(0);
//		if(Vertex.distanceSquare(target, new Vertex(longitude,latitude)) <= tolorance) {
//			System.out.println("remove");
//			movePath.remove(0);
//		}else {
//			Vertex dir = new Vertex(target.getLatitude() - longitude,target.getLongitude() - latitude);
//			dir.normalize();
//			
//			longitude += (dir.getLatitude() * speed);
//			latitude += (dir.getLongitude() * speed);
//		}
//	}
	
	
	
//	public void setMovePath(DoubleStringPair firstPoint, ArrayList<DoubleStringPair> wholePath) {
//		movePath.clear();
//		
//		boolean usePath = false;
//		for(int i=0;i<wholePath.size();i++) {
//			String x1Str = firstPoint.getX();
//			String y1Str = firstPoint.getY();
//			String x2Str = wholePath.get(i).getX();
//			String y2Str = wholePath.get(i).getY();
//			
//			if(!usePath) {
//				if(x1Str.equals(x2Str) && y1Str.equals(y2Str)) {
//					usePath = true;
//					movePath.add(new Vertex(Double.parseDouble(x1Str),Double.parseDouble(y1Str)));
//				}
//			}else {
//				movePath.add(new Vertex(Double.parseDouble(x2Str),Double.parseDouble(y2Str)));
//			}	
//		}
//	}
}
