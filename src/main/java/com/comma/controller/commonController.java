package com.comma.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class commonController {

    @GetMapping("comma")
    public String comma(Model model) {
        model.addAttribute("data", "hello");


        return  "index";
    }
}
