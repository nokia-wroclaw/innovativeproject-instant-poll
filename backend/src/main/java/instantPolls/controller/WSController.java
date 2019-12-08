package instantPolls.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

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
	
	@Autowired
	private SimpMessagingTemplate template;
	
	@MessageMapping("/poll/{roomId}/enter")
	@SendTo("/room/{roomId}/users")
    public SimpleMessage enter(@DestinationVariable String roomId, @Payload String userId, SimpMessageHeaderAccessor simpMessageHeaderAccessor) {
		Room room = roomStorage.findRoomById(roomId);
		room.getUsers().add(userId);
		simpMessageHeaderAccessor.getSessionAttributes().put("user_id", userId);
		simpMessageHeaderAccessor.getSessionAttributes().put("room_id", roomId);
		SimpleMessage message = new SimpleMessage(Integer.toString(room.getNumberOfUsers()));
        return message;
    }
	
	@MessageMapping("/poll/{userId}/allQuestions")
	@SendTo("/user/{userId}/allQuestions")
    public ArrayList<HashMap<String,Object>> sendQuestions(@DestinationVariable String userId,@Payload String roomId) {
		Room room = roomStorage.findRoomById(roomId);
		return room.getListOfQuestionsWithVotes(userId);
    }
	
	@EventListener(SessionDisconnectEvent.class)
    public void handleWebsocketDisconnectListner(SessionDisconnectEvent event) {
    	StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    	String user_id = headerAccessor.getSessionAttributes().get("user_id").toString();	
    	String room_id = headerAccessor.getSessionAttributes().get("room_id").toString();	
    	Room room = roomStorage.findRoomById(room_id);
		if(room != null) {
			room.getUsers().remove(user_id);
			SimpleMessage message = new SimpleMessage(Integer.toString(room.getNumberOfUsers()));
			this.template.convertAndSend("/room/"+room_id+"/users", message);
		}
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
	
	@MessageMapping("/poll/{roomId}/{token}/deleteQuestion")
	@SendTo("/question/{roomId}")
	public QuestionMessage deleteQuestion(@DestinationVariable String roomId, @DestinationVariable String token, @Payload QuestionMessage message) {
		QuestionMessage messageToSend = new QuestionMessage();
		if(message.getAction().equals("delete")) {
			Room room = roomStorage.findRoomById(roomId);
			
			if(room.getToken().equals(token)) {
				int questionId = message.getId();
				room.deleteQuestionById(questionId);
				
				messageToSend.setId(questionId);
				messageToSend.setAction("delete");
			}
		}
		return messageToSend;
	}
}
