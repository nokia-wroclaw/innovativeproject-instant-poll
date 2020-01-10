package instantPolls.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
		questions = new ArrayList<>();
		users = new ArrayList<>();
	}
	
	public List<Map<String, Object>> getListOfQuestionsWithVotes(String userId) {
		List<Map<String, Object>> list = new ArrayList<>();
		questions.forEach(element -> {
			HashMap<String,Object> questionJson = new HashMap<>();
			questionJson.put("id", element.getId());
			questionJson.put("type", element.getType());
			questionJson.put("question", element.getQuestion());
			questionJson.put("answers", element.getOptions());
			questionJson.put("numberOfVotes", element.getNumberOfVotes());
			ArrayList<Integer> ans = new ArrayList<>();
			for(int i = 0; i < element.getAnswers().size(); i++) {
				if(element.getAnswers().get(i).getUsersVoted().contains(userId)) {
					ans.add(i);
				}
			}
			questionJson.put("selected", ans);
			list.add(questionJson);
			questionJson.put("hiddenResults", element.isHiddenResults());
			questionJson.put("active", element.isActive());
		});
		return list;
	}
	
	public void addQuestion(Question question) {
		question.setId(iterator);
		iterator += 1;
		questions.add(question);
	}
	
	public Question getQuestionById(int id) {
		return questions
				.stream()
				.filter(q -> q.getId() == id)
				.findFirst()
				.orElse(null);
	}

	public void deleteQuestionById(int id) {
		for(Question q : questions)
			if(q.getId() == id) {
				questions.remove(q);
				return;
			}
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
		return (int) users.stream().distinct().count();
	}

	public String getShortId() {
		return shortId;
	}

	public void setShortId(String shortId) {
		this.shortId = shortId;
	}
}
