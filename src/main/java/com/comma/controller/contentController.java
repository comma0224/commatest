package com.comma.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class contentController {

    @GetMapping("/reaction-test")
    public ModelAndView loadReactionTest() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("content/test/reaction-test");
        return mv;
    }

    @GetMapping("/click-speed-test")
    public ModelAndView loadClickSpeedTest() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("content/test/click-speed-test");
        return mv;
    }

    @GetMapping("/skill-dps")
    public ModelAndView loadSkillDps() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("content/grow-demon-slime/skill-dps");
        return mv;
    }

    @GetMapping("/familiar-dps")
    public ModelAndView loadFamiliarDps() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("content/grow-demon-slime/familiar-dps");
        return mv;
    }

    @GetMapping("/skill-damage")
    public ModelAndView loadSkillDamage() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("content/grow-demon-slime/skill-damage");
        return mv;
    }

    @GetMapping("/familiar-damage")
    public ModelAndView loadFamiliarDamage() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("content/grow-demon-slime/familiar-damage");
        return mv;
    }

    @GetMapping("/cooldown-efficiency")
    public ModelAndView loadCooldownEfficiency() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("content/grow-demon-slime/cooldown-efficiency");
        return mv;
    }

    @GetMapping("/spec-analysis")
    public ModelAndView loadSpecAnalysis() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("content/grow-demon-slime/spec-analysis");
        return mv;
    }

    @GetMapping("/cooldown-stage")
    public ModelAndView loadCooldownStage() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("content/grow-demon-slime/cooldown-stage");
        return mv;
    }

    @GetMapping("/engraving")
    public ModelAndView loadEngraving() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("content/grow-demon-slime/engraving");
        return mv;
    }
    @GetMapping("/hunt-damage")
    public ModelAndView loadHuntDamage() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("content/grow-demon-slime/hunt-damage");
        return mv;
    }




}