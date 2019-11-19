package com.our.websocket.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;

import com.our.websocket.models.CircleModel;
import com.our.websocket.models.Model;
import com.our.websocket.models.RectModel;
import com.our.websocket.entity.Vertex;

public class OBJLoader {
	
	public static ArrayList<Model> loadObjModel(String fileName) {
		ArrayList<Model> models = null;
		File file = null;
		FileReader fr = null;
		
		// Open file
		try {
			file = new File(fileName);
			fr = new FileReader(file);
		} catch (FileNotFoundException e) {
			// Log messages
			Log.log("OBJLoader", "Couldn't load file!");
			Log.log("OBJLoader", "Couldn't load file!" + "File exists?"  + file.exists());
			e.printStackTrace();
			
			// If failed, return null directly
			return null;
		}
		
		// Up here, file can be successfully opened, so create objects to receive data in the file
		BufferedReader reader = new BufferedReader(fr);
		String line = null;
		
		// Objects storing data parsed from file
		CircleModel circleModel = new CircleModel();
		RectModel rectModel = new RectModel();
		models = new ArrayList<Model>();
		
		try {
			// Read file line by line
			while((line = reader.readLine()) != null) {
				String[] currentLine = line.split(" ");
				
				if(currentLine[0].equals("o")) {		
					if(currentLine[1].equals("circle")) {
						rectModel = null;
						circleModel = new CircleModel();
					}else if (currentLine[1].equals("rect")) {
						circleModel = null;
						rectModel = new RectModel();
					}
				} else if (currentLine[0].equals("v")) {
					Vertex vertex = new Vertex(Double.parseDouble(currentLine[1]),
							Double.parseDouble(currentLine[2]));
					rectModel.addVertex(vertex);
				} else if (currentLine[0].equals("center")) {
					Vertex center = new Vertex(Double.parseDouble(currentLine[1]),
							Double.parseDouble(currentLine[2]));
					circleModel.setCenter(center);
				} else if (currentLine[0].equals("radius")) {
					Double radius = Double.parseDouble(currentLine[1]);
					circleModel.setRadius(radius);
				} //else if (currentLine[0].equals("out")) {
					//Pair vertex = new Pair(Double.parseDouble(currentLine[1]),
					//		Double.parseDouble(currentLine[2]));
					// Load Out data
				//}
				
				else if(currentLine[0].equals("end")) {
					if(circleModel == null) {
						models.add(rectModel);
					}else {
						models.add(circleModel);
					}
				}
			}
			
			reader.close();
		}catch (Exception e) {
			e.printStackTrace();
		}
	
		return models;
	}
}


	
