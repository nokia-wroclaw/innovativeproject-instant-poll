package instantPolls.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class YesNoQuestion implements Question {
	
	private int id;
	private String question;
	private ArrayList<Answer> listOfAnswers;
	private String type;
	private boolean active;
	private boolean hiddenResults;
	
	public YesNoQuestion(String question, List<String> answers) {
		this.question = question;
		this.listOfAnswers = new ArrayList<>();
		answers.forEach(answer -> {
			listOfAnswers.add(new Answer(answer));
		});
		this.type = "yesNo";
		this.active = true;
		this.hiddenResults = false;
	}
	
	public void addAnswer(List<Integer> answer, int question_id, String user_id) {
		listOfAnswers.forEach( a -> {
			if(a.getUsersVoted().contains(user_id)) {
				a.getUsersVoted().remove(user_id);
			}
		});
		listOfAnswers.get(answer.get(0)).getUsersVoted().add(user_id);
	}
	
	public ArrayList<Integer> getNumberOfVotes() {
		ArrayList<Integer> votes = new ArrayList<>();
		if(hiddenResults) {
			votes = new ArrayList<Integer>(Collections.nCopies(listOfAnswers.size(), 0));
			int numberOfVoters = 0;
			for(Answer a : listOfAnswers)
				numberOfVoters += a.getUsersVoted().size();
			votes.set(0, numberOfVoters);
		}
		else 
			for(Answer a : listOfAnswers)
				votes.add(a.getUsersVoted().size());
		
		return votes;
	}
	
	@Override
	public int getTotalVotes() {
		int numberOfVoters = 0;
		for(Answer a : listOfAnswers)
			numberOfVoters += a.getUsersVoted().size();
		return numberOfVoters;
	}
	
	public ArrayList<String> getOptions() {
		ArrayList<String> answers = new ArrayList<>();
		for(Answer a: listOfAnswers) {
			answers.add(a.getAnswer());
		}
		return answers;
	}
	
	public String getQuestion() {
		return question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}
	
	public ArrayList<Answer> getAnswers() {
		return listOfAnswers;
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public ArrayList<Answer> getListOfAnswers() {
		return listOfAnswers;
	}

	public void setListOfAnswers(ArrayList<Answer> listOfAnswers) {
		this.listOfAnswers = listOfAnswers;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public boolean isHiddenResults() {
		return hiddenResults;
	}

	public void setHiddenResults(boolean hiddenResults) {
		this.hiddenResults = hiddenResults;
	}
	
	
}
