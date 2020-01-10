package instantPolls.model;

import java.util.ArrayList;
import java.util.Collections;

public class NumberOfVotesMessage {
	
	private int question_id;
	private ArrayList<Integer> numberOfVotes;
	
	public NumberOfVotesMessage(int question_id, ArrayList<Integer> numberOfVotes) {
		this.question_id = question_id;
		this.numberOfVotes = numberOfVotes;
	}
	
	public int getQuestion_id() {
		return question_id;
	}
	public void setQuestion_id(int question_id) {
		this.question_id = question_id;
	}
	public ArrayList<Integer> getNumberOfVotes() {
		return numberOfVotes;
	}
	public void setNumberOfVotes(ArrayList<Integer> numberOfVotes) {
		this.numberOfVotes = numberOfVotes;
	}
}
