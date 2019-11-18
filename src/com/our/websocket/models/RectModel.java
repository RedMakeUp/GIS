package com.our.websocket.models;

import java.util.ArrayList;

import com.our.websocket.entity.Vertex;

public class RectModel extends Model{
	private ArrayList<Vertex> vertices = new ArrayList<>();
	private final int VertexNum = 100 + 1;
	
	public void addVertex(Vertex vertex) {
		vertices.add(vertex);
	}
	
	@Override
	public ArrayList<Vertex> generateRandomeLocations() {
		System.out.println("From Rect");
		
		//Calculate size of verticesN
		int verticesN = vertices.size();
		int verticesGroups = verticesN/4;
		double m = verticesGroups/2;
		
		//ESPG4326:£¨Lat£¬Long£©=£¨x,y)
		ArrayList<Vertex> Vertexs = new ArrayList<Vertex>();
		for(int i=0;i<VertexNum-1;i++) {
			double g = verticesGroups * Math.random();
			Vertexs.add(createP(g));
			Vertexs.get(i).setName("Vertex_" + i);
		}
		
		return Vertexs;
	}
	
	public Vertex createP(double g) {
		double Lat1 = vertices.get(0+(int)g*4).getLatitude();
		double Long1 = vertices.get(0+(int)g*4).getLongitude();
		double Lat3 = vertices.get(2+(int)g*4).getLatitude();
		double Long2 = vertices.get(1+(int)g*4).getLongitude();
		double dLong = (Long2 - Long1)/2;
		double dLat = (Lat1 - Lat3)/2;
		double Lat = Lat3 + dLat;
		double Long = Long1 + dLong;
		Vertex Vertex = new Vertex(Math.random()*dLat+Lat, Math.random()*dLong+Long);
		return Vertex;
	}
}
