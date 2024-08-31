package com.comma.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class adminController {
    @GetMapping("/user-management")
    public ModelAndView loadUserManagement() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("admin/user-management");
        return mv;
    }

    @GetMapping("/statistics")
    public ModelAndView loadStatistics() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("admin/statistics");
        return mv;
    }

    @GetMapping("/content-management")
    public ModelAndView loadContentManagement() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("members/content-management");
        return mv;
    }
}
