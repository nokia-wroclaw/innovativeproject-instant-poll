package instantPolls.model;

import java.util.ArrayList;
import java.util.List;

public interface Question {
	int getId();
	void setId(int id);
	void addAnswer(List<Integer> answer, int question_id, String user_id);
	String getQuestion();
	ArrayList<String> getOptions();
	ArrayList<Answer> getAnswers();
	ArrayList<Integer> getNumberOfVotes();
	String getType();
	boolean isActive();
	void setActive(boolean active);
	boolean isHiddenResults();
	void setHiddenResults(boolean active);
	int getTotalVotes();
}
