package instantPolls.model;

import java.util.ArrayList;

public class YesNoQuestion implements Question {
	
	private int id;
	private String question;
	private ArrayList<Answer> listOfAnswers;
	
	
	public YesNoQuestion(String question) {
		this.question = question;
		this.listOfAnswers = new ArrayList<>();
		this.listOfAnswers.add(new Answer("Tak"));
		this.listOfAnswers.add(new Answer("Nie"));
	}
	
	public String getQuestion() {
		return question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}
	
	public ArrayList<String> getAnswers() {
		ArrayList<String> answers = new ArrayList<>();
		for(Answer a: listOfAnswers) {
			answers.add(a.getAnswer());
		}
		return answers;
	}

	public void setAnswers(ArrayList<Answer> answers) {
		this.listOfAnswers = answers;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
}
