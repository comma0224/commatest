package com.comma.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;


@Controller
public class AdminController {
    @GetMapping("/member-management")
    public ModelAndView loadUserManagement() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("admin/member-management");
        return mv;
    }

    @GetMapping("/category-management")
    public ModelAndView loadCategoryManagement() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("admin/category-management");
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
        mv.setViewName("admin/content-management");
        return mv;
    }


}
