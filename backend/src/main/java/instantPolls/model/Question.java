package instantPolls.model;

import java.util.ArrayList;

public interface Question {
	int getId();
	void setId(int id);
	String getQuestion();
	ArrayList<String> getAnswers();
}
