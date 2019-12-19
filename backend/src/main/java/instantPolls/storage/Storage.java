package instantPolls.storage;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;

import instantPolls.model.Room;

public interface Storage {
	Room createRoom(String name, String token, LocalDate date, String timeZone);
	Room findRoomById(String id);
	HttpStatus closeRoom(String id, String toke);
	void deleteExpiredRooms();
	String getFullId(String shortId);
}
