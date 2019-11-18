package com.our.websocket.util;

import java.util.HashMap;

public class Log {
	private static HashMap<String,String> logMsgHeaders = new HashMap<>();
	
	public static void setLogMsgHeaders(String fileName,String msgHeader) {
		logMsgHeaders.put(fileName, msgHeader);
	}
	
	public static String getLogMsgHeaders(String fileName) {
		return logMsgHeaders.get(fileName);
	}
	
	public static void log(String fileName, String msg) {
		System.out.println(getLogMsgHeaders(fileName) + msg);
	}
}
