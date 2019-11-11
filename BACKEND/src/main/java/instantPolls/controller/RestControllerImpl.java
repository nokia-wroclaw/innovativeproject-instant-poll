package instantPolls.controller;

import java.util.Collections;
import java.util.Map;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import instantPolls.constants.Constants;

@CrossOrigin(origins = Constants.frontendServerUrl)
@Controller
public class RestControllerImpl {

	@ResponseBody
	@GetMapping(value = "/test")
	public Map<String,String> testing() {
		return Collections.singletonMap("response", "There is connection from Spring Server!");
	}
}