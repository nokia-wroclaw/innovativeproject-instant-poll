package instantPolls.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.stereotype.Controller;
import instantPolls.constants.Constants;
import instantPolls.model.Room;
import instantPolls.storage.Storage;

@CrossOrigin(origins = "*")
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
	@PostMapping(value = "/room/check")
	public List<Room> checkUserRoom(@RequestBody List<String> ids) {
		List<Room> rooms = new ArrayList<>();
		for(String id: ids) {
			Room room = roomStorage.findRoomById(id);
			if(room != null) {
				rooms.add(room);
			}
		}
		return rooms;
	}
	
	@ResponseBody
	@PostMapping(value = "/room/create") 
	public Map<String, String> createRoom(@RequestBody ObjectNode tripData) {
		String name = tripData.findValue("name").asText();
		String date = tripData.findValue("date").asText();
	//	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
		Map<String,String> response = new HashMap<>();
		String id = roomStorage.createRoom(name,LocalDate.parse(date));
		response.put("room_id", id);
		return response;
	}
	
	@ResponseBody
	@GetMapping(value = "/room/{id}")
	public Room getRoom(@PathVariable(value = "id") String id) {
		Room room = roomStorage.findRoomById(id);
		return room;
	}
	
	@ResponseBody
	@PostMapping(value = "/room/close")
	public void closeRoom(@RequestBody ObjectNode tripData) {
		String id = tripData.findValue("room_id").asText();
		roomStorage.closeRoom(id);
	}
}