package instantPolls.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TimeZone;
import java.util.stream.Collectors;

public class Room {
	
	private String id;
	private String shortId;
	private String token;
	private String roomName;
	private TimeZone timeZone;
	private LocalDate expirationDate;
	private ArrayList<Question> questions;
	private List<String> users;
	private int iterator;
	
	public Room(String id, String roomName, LocalDate expirationDate, String timeZoneName) {
		this.id = id;
		this.roomName = roomName;
		this.timeZone = TimeZone.getTimeZone(timeZoneName);
		this.expirationDate = expirationDate;
		expirationDate.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
		questions = new ArrayList<Question>();
		users = new ArrayList<>();
	}
	
	public ArrayList<HashMap<String,Object>> getListOfQuestionsWithVotes(String userId) {
		ArrayList<HashMap<String,Object>> list = new ArrayList<>();
		questions.forEach(question -> {
			HashMap<String,Object> q = new HashMap<>();
			q.put("id", question.getId());
			q.put("type", question.getType());
			q.put("question", question.getQuestion());
			q.put("answers", question.getOptions());
			q.put("numberOfVotes", question.getNumberOfVotes());
			question.getAnswers().forEach(answer -> {
				if(answer.getUsersVoted().contains(userId)) {
					q.put("selected", answer.getAnswer());
					return;
				}
			});
			list.add(q);
		});
		return list;
	}
	
	public void addQuestion(Question question) {
		question.setId(iterator);
		iterator += 1;
		questions.add(question);
	}
	
	public Question getQuestionById(int id) {
		for(Question q: questions) {
			if(q.getId() == id) {
				return q;
			}
		}
		return null;
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

	public ArrayList<Question> getQuestions() {
		return questions;
	}

	public void setQuestions(ArrayList<Question> questions) {
		this.questions = questions;
	}

	public List<String> getUsers() {
		return users;
	}

	public void setUsers(List<String> users) {
		this.users = users;
	}
	
	public int getNumberOfUsers() {
		return users.stream().distinct().collect(Collectors.toList()).size();
	}

	public String getShortId() {
		return shortId;
	}

	public void setShortId(String shortId) {
		this.shortId = shortId;
	}
}
