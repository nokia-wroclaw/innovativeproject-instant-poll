package instantPolls.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import instantPolls.model.SimpleMessage;
import instantPolls.model.Room;
import instantPolls.storage.Storage;

@CrossOrigin(origins = "*")
@Controller
public class WSController {
	
	@Autowired
	Storage roomStorage;
	
	@MessageMapping("/poll/{roomId}/enter")
	@SendTo("/room/{roomId}/users")
    public SimpleMessage enter(@DestinationVariable String roomId) {
        Room r = roomStorage.findRoomById(roomId);
        r.incrementUsers();
        SimpleMessage m = new SimpleMessage(Integer.toString(r.getNumberOfUsers()));
        return m;
    }
	
	@MessageMapping("/poll/{roomId}/exit")
	@SendTo("/room/{roomId}/users")
	public SimpleMessage exit(@DestinationVariable String roomId) {
		Room r = roomStorage.findRoomById(roomId);
		SimpleMessage m = null;
		if(r != null) {
			r.decrementUsers();
	        m = new SimpleMessage(Integer.toString(r.getNumberOfUsers()));
		}
        return m;
	}
}
