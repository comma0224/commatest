package com.comma.controller.session;

import com.comma.service.SessionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @RequestMapping(value = "/checkLogin")
    @ResponseBody
    public Boolean checkLogin(HttpSession session) {
        return  sessionService.checkLogin(session);
    }

}
