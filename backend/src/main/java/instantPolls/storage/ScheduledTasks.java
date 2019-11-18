package instantPolls.storage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {
    
	@Autowired
	private RoomsStorage roomsStorage;
    
    @Scheduled(cron = "1 0 * * * *", zone = "GMT+1") // 1 second after every full hour 
    public void deleteExpiredRooms() {
    	roomsStorage.deleteExpiredRooms();
    }
	

}
