package instantPolls.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.stereotype.Controller;
import instantPolls.model.Room;
import instantPolls.storage.Storage;

@CrossOrigin(origins = "*")
@Controller
public class RestControllerImpl {
	
	@Autowired
	Storage roomStorage;
	
	@ResponseBody
	@PostMapping(value = "/room/created")
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
	@PostMapping(value = "/room") 
	public Map<String, String> createRoom(@RequestBody ObjectNode tripData) {
		String name = tripData.findValue("name").asText();
		String date = tripData.findValue("date").asText();
		String timeZoneName = tripData.findValue("timeZone").asText();
		String tokenJson = tripData.findValue("token").asText();
		String token = null;
		if(!tokenJson.equals("")) {
			token = tokenJson;
		}
		Map<String,String> response = new HashMap<>();
		Room new_room = roomStorage.createRoom(name,token,LocalDate.parse(date),timeZoneName);
		response.put("room_id", new_room.getId());
		response.put("token", new_room.getToken());
		return response;
	}
	
	@ResponseBody
	@GetMapping(value = "/room/{id}")
	public ResponseEntity<Room> getRoom(@PathVariable String id) {
		Room room = roomStorage.findRoomById(id);
		return ResponseEntity.ok(room);
	}
	
	@ResponseBody
	@DeleteMapping(value = "/room/{id}")
	public ResponseEntity<Map<String, String>> closeRoom(@PathVariable String id, @RequestHeader("Authorization") String token) {
		HttpStatus status = roomStorage.closeRoom(id, token); 
		if(status == HttpStatus.OK) 
			return ResponseEntity.ok(Collections.singletonMap("result", "success"));
		else
			return ResponseEntity.status(status).body(Collections.singletonMap("result", "fail"));
	}
	
	@ResponseBody
	@GetMapping(value = "/userID")
	public Map<String,String> getUserID() {
		String id = UUID.randomUUID().toString();
		return Collections.singletonMap("user_id", id);
	}
	
	@GetMapping(value = "/j/{shortLink}")
	public String redirectToRoom(@PathVariable String shortLink) {
		String room_id = roomStorage.getFullId(shortLink);
		return "redirect:/#/pollroom/" + room_id;
	}
}