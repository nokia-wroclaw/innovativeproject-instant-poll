package instantPolls.controller;

import java.util.Collections;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.stereotype.Controller;
import instantPolls.constants.Constants;

@CrossOrigin(origins = Constants.frontendServerUrl)
@Controller
public class RestControllerImpl {
	
  @ResponseBody
	@GetMapping(value = "/test")
	public Map<String,String> testing() {
		return Collections.singletonMap("response", "There is connection from Spring Server!");
	}
  
	@ResponseBody
	@PostMapping(value = "/checkUserRoom")
	public Map<String,Boolean> checkUserRoom(@RequestBody ObjectNode tripData) {
		Map<String,Boolean> response = new HashMap<String,Boolean>();
		response.put("exists", true);
		return response;
	}
}