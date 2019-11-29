package instantPolls.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

public class Room {
	
	private String id;
	private String token;
	private String roomName;
	private TimeZone timeZone;
	private LocalDate expirationDate;
	private int numberOfUsers;
	private Map<Integer,Question> questions; 
	
	public Room(String id, String roomName, LocalDate expirationDate, String timeZoneName) {
		this.id = id;
		this.roomName = roomName;
		this.timeZone = TimeZone.getTimeZone(timeZoneName);
		this.expirationDate = expirationDate;
		expirationDate.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
		questions = new HashMap<Integer,Question>();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getRoomName() {
		return roomName;
	}

	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}

	public LocalDate getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(LocalDate expirationDate) {
		this.expirationDate = expirationDate;
	}

	public TimeZone getTimeZone() {
		return timeZone;
	}

	public void setTimeZone(TimeZone timeZone) {
		this.timeZone = timeZone;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
	
	public void incrementUsers() {
		this.numberOfUsers++;
	}
	
	public void decrementUsers() {
		this.numberOfUsers--;
	}

	public int getNumberOfUsers() {
		return numberOfUsers;
	}

	public void setNumberOfUsers(int numberOfUsers) {
		this.numberOfUsers = numberOfUsers;
	}
	
	public void addQuestion(Question question) {
		questions.put(questions.size(), question);
	}
	
}
