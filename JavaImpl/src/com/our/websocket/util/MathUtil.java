package com.our.websocket.util;

import com.our.websocket.entity.DoubleStringPair;
import com.our.websocket.entity.Vertex;

public class MathUtil {
	public static double distanceSquare(Vertex p1, Vertex p2) {
		return Math.pow(p1.getLatitude() - p2.getLatitude(), 2) + Math.pow(p1.getLongitude() - p2.getLongitude(), 2);
	}
	
	public static double distanceSquare(double x1,double y1,double x2,double y2) {
		return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
	}
	
	public static double distance(double x1,double y1,double x2,double y2) {
		return Math.sqrt(distanceSquare(x1,y1,x2,y2));
	}
	
	public static double distance(DoubleStringPair p1, DoubleStringPair p2) {
		double x1 = Double.parseDouble(p1.getX());
    	double y1 = Double.parseDouble(p1.getY());
    	double x2 = Double.parseDouble(p2.getX());
    	double y2 = Double.parseDouble(p2.getY());
    	
		return distance(x1,y1,x2,y2);
	}
	
	
}
