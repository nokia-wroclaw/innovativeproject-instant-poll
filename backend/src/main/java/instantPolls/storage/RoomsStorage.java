package instantPolls.storage;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import instantPolls.model.Room;

@Component
public class RoomsStorage implements Storage {
	
	volatile private Map<String,Room> rooms;
	
	public RoomsStorage() {
		rooms = new TreeMap<>();
	}
	
	@Override
	public Room createRoom(String name, String token, LocalDate date, String timeZone) {
		String generatedId = generateId();
		Room new_room = new Room(generatedId, name, date, timeZone);
		if(token == null) {
			token = generateId();
		}
		new_room.setToken(token);
		rooms.put(generatedId, new_room);
		return new_room;
	}
	
	@Override
	public Room findRoomById(String id) {
		return rooms.get(id);
	}
	
	@Override
	public boolean closeRoom(String id, String token) {
		Room room = rooms.get(id);
		if(room != null && room.getToken().equals(token)) {
			rooms.remove(id);
			return true;
		} else
			return false;
	}
	
	@Override
	public void deleteExpiredRooms() {
		Logger log = LoggerFactory.getLogger(RoomsStorage.class);
		
		TimeZone localTimeZone = TimeZone.getDefault();
		int offSetLocalTimeZone = localTimeZone.getOffset(System.currentTimeMillis()) / 1000 / 60;	// server to UTC in minutes

		rooms.entrySet().removeIf(entry -> {
			Room room = entry.getValue();
			TimeZone timeZone = room.getTimeZone();
    		int offSetRoomTimeZone = timeZone.getOffset(System.currentTimeMillis()) / 1000 / 60;	// room to UTC in minutes
    		int offSetToLocal = offSetLocalTimeZone - offSetRoomTimeZone;
    		LocalDate dateInRoomTimeZone = LocalDateTime.now().minusMinutes(offSetToLocal).toLocalDate();
    		
    		if (room.getExpirationDate().isBefore(dateInRoomTimeZone)) {	
    			log.info("Room with id: " + room.getId() + "was deleted");
    			return true;
    		} else
    			return false;
		});	
	}
	
	private String generateId() {
		return UUID.randomUUID().toString();
	}

	public Map<String, Room> getRooms() {
		return rooms;
	}

	public void setRooms(Map<String, Room> rooms) {
		this.rooms = rooms;
	}
	
	
}
