package instantPolls.model;

import java.util.ArrayList;

public interface Question {
	int getId();
	void setId(int id);
	String getQuestion();
	ArrayList<String> getOptions();
	ArrayList<Answer> getAnswers();
	void addAnswer(String answer, int question_id, String user_id);
	ArrayList<Integer> getNumberOfVotes();
}
