package instantPolls.model;

public class YesNoQuestion implements Question {
	
	private String question;
	private int numberOfYes;
	private int numberOfNo;
	
	
	public YesNoQuestion(String question) {
		this.question = question;
		numberOfNo = 0;
		numberOfYes = 0;
	}
	
	public String getQuestion() {
		return question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}

	public int getNumberOfYes() {
		return numberOfYes;
	}

	public void setNumberOfYes(int numberOfYes) {
		this.numberOfYes = numberOfYes;
	}

	public int getNumberOfNo() {
		return numberOfNo;
	}

	public void setNumberOfNo(int numberOfNo) {
		this.numberOfNo = numberOfNo;
	}
}
