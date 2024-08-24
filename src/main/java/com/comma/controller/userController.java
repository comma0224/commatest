package com.comma.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class userController {

    @GetMapping("/reaction-test")
    public String loadReactionTest(Model model) {
        return "user/test/reaction-test";
    }

    @GetMapping("/click-speed-test")
    public String loadClickSpeedTest(Model model) {
        return "user/test/click-speed-test";
    }

    @GetMapping("/skill-dps")
    public String loadSkillDps(Model model) {
        return "user/grow-demon-slime/skill-dps";
    }

    @GetMapping("/familiar-dps")
    public String loadFamiliarDps(Model model) {
        return "user/grow-demon-slime/familiar-dps";
    }

    @GetMapping("/skill-damage")
    public String loadSkillDamage(Model model) {
        return "user/grow-demon-slime/skill-damage";
    }

    @GetMapping("/familiar-damage")
    public String loadFamiliarDamage(Model model) {
        return "user/grow-demon-slime/familiar-damage";
    }

    @GetMapping("/cooldown-efficiency")
    public String loadCooldownEfficiency(Model model) {
        return "user/grow-demon-slime/cooldown-efficiency";
    }

    @GetMapping("/spec-analysis")
    public String loadSpecAnalysis(Model model) {
        return "user/grow-demon-slime/spec-analysis";
    }

    @GetMapping("/cooldown-stage")
    public String loadCooldownStage(Model model) {
        return "user/grow-demon-slime/cooldown-stage";
    }


}