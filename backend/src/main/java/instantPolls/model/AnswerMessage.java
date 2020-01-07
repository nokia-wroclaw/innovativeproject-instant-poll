package instantPolls.model;

import java.util.List;

public class AnswerMessage {
	
	private String user_id;
	private int question_id; 
	private List<Integer> answer;


	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	public int getQuestion_id() {
		return question_id;
	}
	public void setQuestion_id(int question_id) {
		this.question_id = question_id;
	}
	public List<Integer> getAnswer() {
		return answer;
	}
	public void setAnswer(List<Integer> answer) {
		this.answer = answer;
	}
}
