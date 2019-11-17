package instantPolls.storage;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import instantPolls.model.Room;

@Component
public class ScheduledTasks {
    
	@Autowired
	private RoomsStorage roomsStorage;
	private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);
    private static final DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd.MM.yyyy");
    
    @Scheduled(cron = "1 0 0 * * *", zone = "GMT+1") // 1 second after midnight 
    public void deleteExpiredRooms() {
    	
    	Map<String,Room> rooms = roomsStorage.getRooms();
    	Iterator<Map.Entry<String, Room>> it = rooms.entrySet().iterator();
    	while(it.hasNext()) {
    		Map.Entry<String, Room> pair = it.next();
    		if (pair.getValue().getExpirationDate().isBefore(LocalDate.now())) {
    			it.remove();
    			log.info("Room with id: " + pair.getKey() + "was deleted");
    		}
    	}
    }
	

}
