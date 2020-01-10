package instantPolls.model;

import java.util.ArrayList;

public class ActionMessage {

	private int questionId;
	private boolean active;
	private boolean hiddenResults;
	private ArrayList<Integer> numberOfVotes;
	
	public ActionMessage(int questionId, boolean active, boolean hiddenResults) {
		this.questionId = questionId;
		this.active = active;
		this.hiddenResults = hiddenResults;
	}
	
	public int getQuestionId() {
		return questionId;
	}
	public void setQuestionId(int questionId) {
		this.questionId = questionId;
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

	public ArrayList<Integer> getNumberOfVotes() {
		return numberOfVotes;
	}

	public void setNumberOfVotes(ArrayList<Integer> numberOfVotes) {
		this.numberOfVotes = numberOfVotes;
	}
	
	
}
