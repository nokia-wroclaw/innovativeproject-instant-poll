package instantPolls.storage;

import java.util.*;

import org.springframework.stereotype.Component;
import instantPolls.model.Room;

@Component
public class RoomsStorage implements Storage {
	
	private Map<String,Room> rooms;
	
	public RoomsStorage() {
		rooms = new TreeMap<>();
	}
	
	@Override
	public String createRoom() {
		String generatedId = generateId();
		Room new_room = new Room(generatedId);
		rooms.put(generatedId, new_room);
		return generatedId;
	}
	
	@Override
	public Room findRoomById(String id) {
		return rooms.get(id);
	}
	
	private String generateId() {
		return UUID.randomUUID().toString();
	}
}
