package instantPolls.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import instantPolls.model.SimpleMessage;
import instantPolls.model.YesNoQuestion;
import instantPolls.model.AnswerMessage;
import instantPolls.model.NumberOfVotesMessage;
import instantPolls.model.Question;
import instantPolls.model.QuestionMessage;
import instantPolls.model.Room;
import instantPolls.storage.Storage;

@CrossOrigin(origins = "*")
@Controller
public class WSController {
	
	@Autowired
	Storage roomStorage;
	
	@MessageMapping("/poll/{roomId}/enter")
	@SendTo("/room/{roomId}/users")
    public SimpleMessage enter(@DestinationVariable String roomId, @Payload String userId) {
		Room room = roomStorage.findRoomById(roomId);
		room.getUsers().add(userId);
		SimpleMessage message = new SimpleMessage(Integer.toString(room.getNumberOfUsers()));
        return message;
    }
	
	@MessageMapping("/poll/{userId}/allQuestions")
	@SendTo("/user/{userId}/allQuestions")
    public ArrayList<HashMap<String,Object>> sendQuestions(@DestinationVariable String userId,@Payload String roomId) {
		Room room = roomStorage.findRoomById(roomId);
		return room.getListOfQuestionsWithVotes(userId);
    }
	
	@MessageMapping("/poll/{roomId}/exit")
	@SendTo("/room/{roomId}/users")
	public SimpleMessage exit(@DestinationVariable String roomId, @Payload String userId) {
		Room r = roomStorage.findRoomById(roomId);
		SimpleMessage m = null;
		if(r != null) {
			r.getUsers().remove(userId);
			m = new SimpleMessage(Integer.toString(r.getNumberOfUsers()));
		}
        return m;
	}
	
	@MessageMapping("/poll/{roomId}/addQuestion/{questionType}")
	@SendTo("/question/{roomId}")
	public QuestionMessage addQuestion(@DestinationVariable String roomId, @DestinationVariable String questionType, @Payload QuestionMessage message) {
		Question question = null;
		QuestionMessage messageToSend = new QuestionMessage();
		if(questionType.equals("yesNo")) {
			question = new YesNoQuestion(message.getQuestion());
			messageToSend.setQuestion(question.getQuestion());
			messageToSend.setType("yesNo");
			messageToSend.setAnswers(question.getOptions());
			messageToSend.setNumberOfVotes(question.getNumberOfVotes());
		} 
			
		roomStorage.findRoomById(roomId).addQuestion(question);
		messageToSend.setId(question.getId());
		return messageToSend;
	}
	
	@MessageMapping("/poll/{roomId}/answer")
	@SendTo("/answer/{roomId}")
	public NumberOfVotesMessage getAnswer(@DestinationVariable String roomId, @Payload AnswerMessage message) {
		Room room = roomStorage.findRoomById(roomId);
		Question question = room.getQuestionById(message.getQuestion_id());
		question.addAnswer(message.getAnswer(), message.getQuestion_id(), message.getUser_id());
		return new NumberOfVotesMessage(question.getId(),question.getNumberOfVotes());
	}
}
