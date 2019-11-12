package instantPolls.storage;

import instantPolls.model.Room;

public interface Storage {
	String createRoom();
	Room findRoomById(String id);
}
