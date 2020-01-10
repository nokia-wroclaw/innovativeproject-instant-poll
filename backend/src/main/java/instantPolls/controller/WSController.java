package instantPolls.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import instantPolls.model.SingleAnswerQuestion;
import instantPolls.model.YesNoQuestion;
import instantPolls.model.ActionMessage;
import instantPolls.model.AnswerMessage;
import instantPolls.model.MultipleAnswersQuestion;
import instantPolls.model.NumberOfVotesMessage;
import instantPolls.model.Question;
import instantPolls.model.QuestionMessage;
import instantPolls.model.RateQuestion;
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
	
	@MessageMapping("/poll/{roomId}/getNumberOfUsers")
	@SendTo("/room/{roomId}/users")
    public SimpleMessage getNumberOfUsers(@DestinationVariable String roomId, @Payload String userId, SimpMessageHeaderAccessor simpMessageHeaderAccessor) {
		Room room = roomStorage.findRoomById(roomId);
		SimpleMessage message = new SimpleMessage();
		if(room != null) {
			message.setContent(Integer.toString(room.getNumberOfUsers()));
		} 
        return message;
    }
	
	@MessageMapping("/poll/{userId}/allQuestions")
	@SendTo("/user/{userId}/allQuestions")
    public List<Map<String, Object>> sendQuestions(@DestinationVariable String userId,@Payload String roomId) {
		Room room = roomStorage.findRoomById(roomId);
		return room.getListOfQuestionsWithVotes(userId);
    }
	
	@EventListener(SessionDisconnectEvent.class)
    public void handleWebsocketDisconnectListner(SessionDisconnectEvent event) {
    	StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    	if(headerAccessor == null) {
    		return;
    	}
    	String user_id = headerAccessor.getSessionAttributes().get("user_id").toString();	
    	String room_id = headerAccessor.getSessionAttributes().get("room_id").toString();	
    	Room room = roomStorage.findRoomById(room_id);
		if(room != null) {
			room.getUsers().remove(user_id);
			SimpleMessage message = new SimpleMessage(Integer.toString(room.getNumberOfUsers()));
			this.template.convertAndSend("/room/"+room_id+"/users", message);
		}
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
		
		if(questionType.equals("yesNo")) { //convert to enum when more types of questions
			question = new YesNoQuestion(message.getQuestion());
			QuestionMessage messageToSend = QuestionMessage.builder()
					.type(question.getType())
					.question(question.getQuestion())
					.answers(question.getOptions())
					.numberOfVotes(question.getNumberOfVotes())
					.selected(new ArrayList<Integer>())
					.build();

			roomStorage.findRoomById(roomId).addQuestion(question);
			messageToSend.setId(question.getId());
			return messageToSend;
			
		} else if(questionType.equals("optionsMultiple")) {
			question = new MultipleAnswersQuestion(message.getQuestion(),message.getAnswers());
			QuestionMessage messageToSend = QuestionMessage.builder()
					.type(question.getType())
					.question(question.getQuestion())
					.answers(question.getOptions())
					.numberOfVotes(question.getNumberOfVotes())
					.selected(new ArrayList<Integer>())
					.build();
			
			roomStorage.findRoomById(roomId).addQuestion(question);
			messageToSend.setId(question.getId());
			return messageToSend;
			
		} else if(questionType.equals("optionsSingle")) {
			question = new SingleAnswerQuestion(message.getQuestion(),message.getAnswers());
			QuestionMessage messageToSend = QuestionMessage.builder()
					.type(question.getType())
					.question(question.getQuestion())
					.answers(question.getOptions())
					.numberOfVotes(question.getNumberOfVotes())
					.selected(new ArrayList<Integer>())
					.build();
			roomStorage.findRoomById(roomId).addQuestion(question);
			messageToSend.setId(question.getId());
			return messageToSend;
			
		} else if(questionType.equals("rate")) {			
			RateQuestion que = new RateQuestion(message.getQuestion(),message.getAnswers());
			ArrayList<Integer> selected = new ArrayList<Integer>();
			selected.add(que.getFrom());
			QuestionMessage messageToSend = QuestionMessage.builder()
					.type(que.getType())
					.question(que.getQuestion())
					.answers(que.getOptions())
					.numberOfVotes(que.getNumberOfVotes())
					.selected(selected)
					.build();
			
			roomStorage.findRoomById(roomId).addQuestion(que);
			messageToSend.setId(que.getId());
			return messageToSend;
		}
		return null;
	
	}
	
	@MessageMapping("/poll/{roomId}/answer")
	@SendTo("/answer/{roomId}")
	public NumberOfVotesMessage getAnswer(@DestinationVariable String roomId, @Payload AnswerMessage message) {
		Room room = roomStorage.findRoomById(roomId);
		Question question = room.getQuestionById(message.getQuestion_id());
		if(question.isActive())
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
	
	@MessageMapping("/poll/{roomId}/{token}/action")
	@SendTo("/action/{roomId}")
	public ActionMessage doAction(@DestinationVariable String roomId, @DestinationVariable String token, @Payload ActionMessage message) {
		Room room = roomStorage.findRoomById(roomId);
		if(room.getToken().equals(token)) {
			Question question = room.getQuestionById(message.getQuestionId());
			if((message.isActive() && !question.isActive()) ||(!message.isActive() && question.isActive() ))
				question.setActive(message.isActive());
			if((message.isHiddenResults() && !question.isHiddenResults()) ||(!message.isHiddenResults() && question.isHiddenResults() )) {
				question.setHiddenResults(message.isHiddenResults());
				if(!question.isHiddenResults()) {
					message.setNumberOfVotes(question.getNumberOfVotes());
				}
			}
		}
		return message;
	}

}
