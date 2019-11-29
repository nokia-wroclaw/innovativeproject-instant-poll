package instantPolls.model;

import java.util.HashSet;
import java.util.Set;

public class Answer {
	private String answer;
	private Set<String> usersVoted;
	
	public Answer(String answer) {
		this.answer = answer;
		usersVoted = new HashSet<>();
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public Set<String> getUsersVoted() {
		return usersVoted;
	}

	public void setUsersVoted(Set<String> usersVoted) {
		this.usersVoted = usersVoted;
	}
}
