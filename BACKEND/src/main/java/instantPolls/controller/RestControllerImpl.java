package instantPolls.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.node.ObjectNode;

import instantPolls.constants.Constants;

@CrossOrigin(origins = Constants.frontendServerUrl)
@RestController
public class RestControllerImpl {
	
	@GetMapping(value = "/")
	public Map<String,String> testing() {
		return Collections.singletonMap("response", "There is connection from Spring Server!");
	}
	
	@PostMapping(value = "/checkUserRoom")
	public Map<String,Boolean> checkUserRoom(@RequestBody ObjectNode tripData) {
		Map<String,Boolean> response = new HashMap<String,Boolean>();
		response.put("exists", true);
		return response;
	}
}