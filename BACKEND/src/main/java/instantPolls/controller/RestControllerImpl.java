package instantPolls.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import instantPolls.constants.Constants;

@CrossOrigin(origins = Constants.frontendServerUrl)
@RestController
public class RestControllerImpl {
	
	@GetMapping(value = "/")
	public Map<String,String> testing() {
		return Collections.singletonMap("response", "There is connection from Spring Server!");
	}
}