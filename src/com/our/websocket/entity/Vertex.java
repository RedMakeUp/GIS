package com.our.websocket.entity;

public class Vertex {
	private static final double DEFAULT_LONGITUDE = 0.0;
	private static final double DEFAULT_LATITUDE = 0.0;
	
	private double latitude;
	private double longitude;
	private double intensity;
	private String name;
	
	public Vertex(double latitude,double longitude) {
		this.latitude = latitude;
		this.longitude = longitude;
		name = "Undefined";
	}
	
	public Vertex(String name) {
		this.name = name;
		this.latitude = DEFAULT_LATITUDE;
		this.longitude = DEFAULT_LONGITUDE;
	}
	
	public Vertex(String name, double latitude,double longitude) {
		this.latitude = latitude;
		this.longitude = longitude;
		this.name = name;
	}
	
	public Vertex() {}
	
	public void setLatitude(double latitude) {this.latitude = latitude;}
	public void setLongitude(double longitude) {this.longitude = longitude;}
	public void setName(String name) {this.name = name;}
	public void setIntensity(double intensity) {this.intensity = intensity;}
	
	public double getLatitude() {return latitude;}
	public double getLongitude() {return longitude;}
	public String getName() {return name;}
	public double getIntensity() {return intensity;}
	
	public void normalize() {
		double len = length();
		
		latitude /= len;
		longitude /= len;
	}
	
	public double length() {
		return Math.sqrt(Math.pow(latitude, 2) + Math.pow(longitude, 2));
	}
	
	public static double distanceSquare(Vertex p1, Vertex p2) {
		return Math.pow(p1.getLatitude() - p2.getLatitude(), 2) + Math.pow(p1.getLongitude() - p2.getLongitude(), 2);
	}
	
	public static double distance(Vertex p1, Vertex p2) {
		return Math.sqrt(distanceSquare(p1,p2));
	}
	
	@Override
	public boolean equals(Object o)
	{
		if (this == o)
			return true;

		if (o == null || getClass() != o.getClass())
			return false;

		Vertex vertex = (Vertex)o;

		if(latitude == vertex.latitude && longitude == vertex.longitude && name.equals(vertex.name))
			return true;
		return false;
	}
	
	@Override
	public String toString() {
		return "[" + name + " , Lat: " + String.valueOf(latitude) + " , Lng: " + String.valueOf(longitude) + "]"; 
	}
}
