package instantPolls.controller;

import java.util.Collections;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.stereotype.Controller;
import instantPolls.constants.Constants;
import instantPolls.storage.Storage;

@CrossOrigin(origins = Constants.frontendServerUrl)
@Controller
public class RestControllerImpl {
	
	@Autowired
	Storage roomStorage;
	
	@ResponseBody
	@GetMapping(value = "/test")
	public Map<String,String> testing() {
		return Collections.singletonMap("response", "There is connection from Spring Server!");
	}
  
	@ResponseBody
	@PostMapping(value = "/checkUserRoom")
	public Map<String,Boolean> checkUserRoom(@RequestBody ObjectNode tripData) {
		String id = tripData.findValue("room_id").asText();
		Map<String,Boolean> response = new HashMap<>();
		if(roomStorage.findRoomById(id) == null) {
			response.put("exists", false);
		} else {
			response.put("exists", true);
		}
		return response;
	}
	
	@GetMapping(value = "/createRoom") 
	public Map<String, String> createRoom() {
		Map<String,String> response = new HashMap<>();
		String id = roomStorage.createRoom();
		response.put("room_id", id);
		return response;
	}
}