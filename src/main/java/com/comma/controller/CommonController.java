package com.comma.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;

@Controller
public class CommonController {

    @RequestMapping(value = "/", method = {RequestMethod.GET, RequestMethod.POST})
    public ModelAndView index() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("index");
        return mv;
    }

    @PostMapping("/checkMemberLevel")
    @ResponseBody
    public HashMap<String, Object> checkSession(HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();
        String memberLevel = (String) session.getAttribute("memberLevel");

        if (memberLevel == null) {
            memberLevel = "guest";
        }

        response.put("memberLevel", memberLevel);
        return response;
    }


}
