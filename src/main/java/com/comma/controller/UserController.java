package com.comma.controller;

import com.comma.domain.user.User;
import com.comma.service.SessionService;
import com.comma.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

@Controller
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private SessionService sessionService;

    @GetMapping("/user-login")
    public ModelAndView loadUserLogin() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("user/user-login");
        return mv;
    }

    @GetMapping("/user-register")
    public ModelAndView loadUserRegister() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("user/user-register");
        return mv;
    }

    @GetMapping("/user-info")
    public ModelAndView loadUserInfo(HttpSession session) {
        ModelAndView mv = new ModelAndView();

        Long userKey = (Long) session.getAttribute("userKey");
        User user = userService.getUser(userKey);
        mv.addObject("user", user);
        mv.setViewName("user/user-info");
        return mv;
    }

    @PostMapping("/is-user-id-exists")
    @ResponseBody
    public HashMap<String, Object> isUserIdExists(@RequestBody String userId) {
        HashMap<String, Object> response = new HashMap<>();
        boolean exists = userService.isUserIdExists(userId);
        response.put("status", exists);
        return response;
    }

    @PostMapping("/is-nickname-exists")
    @ResponseBody
    public HashMap<String, Object> isNicknameExists(@RequestBody String nickname) {
        HashMap<String, Object> response = new HashMap<>();
        boolean exists = userService.isNicknameExists(nickname);
        response.put("status", exists);
        return response;
    }

    @PostMapping("/login")
    @ResponseBody
    public HashMap<String, Object> login(@RequestBody Map<String, String> request, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();

        try {
            String userId = request.get("userId");
            String userPassword = request.get("userPassword");
            userService.loginUser(userId, userPassword, session);

            response.put("status", true);
            response.put("message", "로그인이 완료되었습니다.");
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/register")
    @ResponseBody
    public HashMap<String, Object> register(@RequestBody HashMap<String, String> request) {
        HashMap<String, Object> response = new HashMap<>();

        try {
            userService.registerUser(request);

            response.put("status", true);
            response.put("message", "회원가입이 완료되었습니다.");
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/update-user")
    @ResponseBody
    public HashMap<String, Object> updateUser(@RequestBody User user, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();
        Long userKey = (Long) session.getAttribute("userKey");

        try {
            // 업데이트된 멤버 정보 저장
            userService.updateUser(user, userKey);

            // 업데이트된 멤버 정보를 다시 가져와서 응답에 포함
            User updatedUser = userService.getUser(userKey);
            response.put("status", true);
            response.put("message", "회원 정보가 수정되었습니다.");
            response.put("updatedUser", updatedUser);
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", "회원 정보 수정에 실패했습니다.");
        }

        return response;
    }

    @PostMapping("/update-user-password")
    @ResponseBody
    public HashMap<String, Object> updateUserPassword(@RequestBody User user, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();
        Long userKey = (Long) session.getAttribute("userKey");

        try {
            // 업데이트된 멤버 정보 저장
            userService.updateUser(user, userKey);

            response.put("status", true);
            response.put("message", "회원 정보가 수정되었습니다.");
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", "회원 정보 수정에 실패했습니다.");
        }

        return response;
    }

    @PostMapping("/delete-user")
    @ResponseBody
    public HashMap<String, Object> deleteUser(@RequestBody User user, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();
        Long userKey = (Long) session.getAttribute("userKey");

        try {
            userService.deleteUser(user, userKey);
            sessionService.invalidateSession(session);

            response.put("status", true);
            response.put("message", "회원 탈퇴가 완료되었습니다.");
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", e.getMessage());
        }

        return response;
    }

    @PostMapping("/user-logout")
    @ResponseBody
    public HashMap<String, Object> logout(HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();
        sessionService.invalidateSession(session);

        response.put("status", true);
        response.put("message", "로그아웃 되었습니다.");
        return response;
    }



}
