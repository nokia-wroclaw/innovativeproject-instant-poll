package instantPolls.model;

import java.util.ArrayList;
import java.util.List;

public class RateQuestion implements Question{
	private int id;
	private String question;
	private ArrayList<Answer> listOfAnswers;
	private String type;
	private int from;
	private int to;
	
	
	public RateQuestion(String question,List<String> answers) {
		this.question = question;
		this.listOfAnswers = new ArrayList<>();
		this.from = Integer.parseInt(answers.get(0));
		this.to = Integer.parseInt(answers.get(1));
		for(int i = from; i <= to; i++) {
			listOfAnswers.add(new Answer(Integer.toString(i)));
		}
		this.type = "rate";
	}
	
	public void addAnswer(List<Integer> answer, int question_id, String user_id) {
		listOfAnswers.forEach( a -> {
			if(a.getUsersVoted().contains(user_id)) {
				a.getUsersVoted().remove(user_id);
			}
		});
		listOfAnswers.get(answer.get(0)-from).getUsersVoted().add(user_id);
	}
	
	public ArrayList<Integer> getNumberOfVotes() {
		ArrayList<Integer> votes = new ArrayList<>();
		for(Answer a : listOfAnswers) {
			votes.add(a.getUsersVoted().size());
		}
		return votes;
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

	public int getFrom() {
		return from;
	}

	public void setFrom(int from) {
		this.from = from;
	}

	public int getTo() {
		return to;
	}

	public void setTo(int to) {
		this.to = to;
	}
}
