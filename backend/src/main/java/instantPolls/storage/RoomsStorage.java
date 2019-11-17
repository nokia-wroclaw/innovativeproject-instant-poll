package instantPolls.storage;

import java.time.LocalDate;
import java.util.*;

import org.springframework.stereotype.Component;
import instantPolls.model.Room;

@Component
public class RoomsStorage implements Storage {
	
	volatile private Map<String,Room> rooms;
	
	public RoomsStorage() {
		rooms = new TreeMap<>();
	}
	
	@Override
	public String createRoom(String name, LocalDate date) {
		String generatedId = generateId();
		Room new_room = new Room(generatedId,name,date);
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

	@Override
	public Room closeRoom(String id) {
		rooms.remove(id);
		return null;
	}

	public Map<String, Room> getRooms() {
		return rooms;
	}

	public void setRooms(Map<String, Room> rooms) {
		this.rooms = rooms;
	}
	
	
}
