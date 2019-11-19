package com.our.websocket.entity;

public class DoubleStringPair {
	private String x;
	private String y;
	
	public DoubleStringPair(String x,String y) {
		this.x = x;
		this.y = y;
	}
	
	public void setX(String x) {this.x = x;}
	public void setY(String y) {this.y = y;}
	
	public String getX() {return x;}
	public String getY() {return y;}
	
	@Override
	public String toString() {
		return "[" + x + " , " + y + "]"; 
	}
}
