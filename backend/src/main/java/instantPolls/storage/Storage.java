package instantPolls.storage;

import java.time.LocalDate;

import instantPolls.model.Room;

public interface Storage {
	Room createRoom(String name, String token, LocalDate date, String timeZone);
	Room findRoomById(String id);
	boolean closeRoom(String id, String toke);
	void deleteExpiredRooms();
}
