package instantPolls.model;

import java.util.ArrayList;

public class QuestionMessage {
	private int id;
	private String type;
	private String question;
	private String action; // question add or remove
	private int totalNumberOfVotes;
	private ArrayList<String> answers;
	private ArrayList<Integer> numberOfVotes;
	private ArrayList<Integer> selected;
	private boolean active;
	private boolean hiddenResults;
	
	public static final class Builder {
		private int id;
		private String type;
		private String question;
		private String action; // question add or remove
		private int totalNumberOfVotes;
		private ArrayList<String> answers;
		private ArrayList<Integer> numberOfVotes;
		private ArrayList<Integer> selected;
		
		public Builder id(int id) {
			this.id = id;
			return this;
		}
		
		public Builder type(String type) {
			this.type = type;
			return this;
		}
		
		public Builder question(String question) {
			this.question = question;
			return this;
		}
		
		public Builder action(String action) {
			this.action = action;
			return this;
		}
		
		public Builder answers(ArrayList<String> answers) {
			this.answers = answers;
			return this;
		}
		
		public Builder numberOfVotes(ArrayList<Integer> numberOfVotes) {
			this.numberOfVotes = numberOfVotes;
			return this;
		}
		
		public Builder selected(ArrayList<Integer> selected) {
			this.selected = selected;
			return this;
		}

		public Builder totalNumberOfVotes(int totalNumberOfVotes) {
			this.totalNumberOfVotes = totalNumberOfVotes;
			return this;
		}
		
		public QuestionMessage build() {
			QuestionMessage questionMessage = new QuestionMessage();
			questionMessage.id = this.id;
			questionMessage.type = this.type;
			questionMessage.question = this.question;
			questionMessage.action = this.action;
			questionMessage.answers = this.answers;
			questionMessage.numberOfVotes = this.numberOfVotes;
			questionMessage.selected = this.selected;
			questionMessage.totalNumberOfVotes =this.totalNumberOfVotes;
		
			return questionMessage;
		}
		
	}
	
	public static Builder builder() {
	    return new Builder();
	}
	
	public QuestionMessage() {
		this.active = true;
		this.hiddenResults = false;
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

	public ArrayList<Integer> getSelected() {
		return selected;
	}

	public void setSelected(ArrayList<Integer> selected) {
		this.selected = selected;
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

	public int getTotalNumberOfVotes() {
		return totalNumberOfVotes;
	}

	public void setTotalNumberOfVotes(int totalNumberOfVotes) {
		this.totalNumberOfVotes = totalNumberOfVotes;
	}
	
}
