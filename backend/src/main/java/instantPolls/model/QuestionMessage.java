package instantPolls.model;

import java.util.ArrayList;

public class QuestionMessage {
	private int id;
	private String type;
	private String question;
	private String action; // question add or remove
	private ArrayList<String> answers;
	private ArrayList<Integer> numberOfVotes;
	
	
	public QuestionMessage() {
		
	}
	
	public QuestionMessage(String type, String question, ArrayList<String> answers) {
		this.type = type;
		this.question = question;
		this.answers = answers;
	}

	public String getQuestion() {
		return question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}

	public ArrayList<String> getAnswers() {
		return answers;
	}

	public void setAnswers(ArrayList<String> answers) {
		this.answers = answers;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public ArrayList<Integer> getNumberOfVotes() {
		return numberOfVotes;
	}

	public void setNumberOfVotes(ArrayList<Integer> numberOfVotes) {
		this.numberOfVotes = numberOfVotes;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}
	
}
