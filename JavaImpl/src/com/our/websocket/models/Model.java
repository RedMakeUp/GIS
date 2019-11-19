package com.our.websocket.models;

import java.util.ArrayList;

import com.our.websocket.entity.Vertex;

public class Model {
	protected String name;
	protected ArrayList<Vertex> exitLocations;
	
	protected Model() {
		exitLocations = new ArrayList<>();
	}

	public ArrayList<Vertex> generateRandomeLocations() {
		return null;
	}
	
	public void setName(String name) {this.name = name;}
	public void addExitLocation(Vertex exitLoc) {exitLocations.add(exitLoc);}
	
	public String getName() {return name;}
	public ArrayList<Vertex> getExitLocation(){return exitLocations;}
}
