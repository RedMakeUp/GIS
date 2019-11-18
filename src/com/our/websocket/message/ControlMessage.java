package com.our.websocket.message;

import java.util.ArrayList;

import com.our.websocket.entity.DoubleStringPair;

public class ControlMessage implements Message {
	private String isNeedPosData;// Yes or no
	private ArrayList<DoubleStringPair> pathPoints;
	
	public String getIsNeedPosData() {
		return isNeedPosData;
	}
	
	public void setIsNeedPosData(String msg) {
		this.isNeedPosData = msg;
	}
	
	public ArrayList<DoubleStringPair> getPathPoints(){
		return pathPoints;
	}
	
	public void setPathPoints(ArrayList<DoubleStringPair> pathPoints) {
		this.pathPoints = pathPoints;
	}	
}
