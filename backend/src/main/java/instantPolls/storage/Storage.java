package instantPolls.storage;

import java.time.LocalDate;

import instantPolls.model.Room;

public interface Storage {
	String createRoom(String name, LocalDate date, String timeZone);
	Room findRoomById(String id);
	Room closeRoom(String id);
	void deleteExpiredRooms();
}
