package instantPolls.model;

import java.util.ArrayList;

public interface Question {
	int getId();
	void setId(int id);
	void addAnswer(String answer, int question_id, String user_id);
	String getQuestion();
	ArrayList<String> getOptions();
	ArrayList<Answer> getAnswers();
	ArrayList<Integer> getNumberOfVotes();
	String getType();
}
