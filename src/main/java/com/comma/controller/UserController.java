package com.comma.controller;

import com.comma.domain.user.User;
import com.comma.service.SessionService;
import com.comma.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

@Controller
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private SessionService sessionService;

    @GetMapping("/login")
    public ModelAndView loadUserLogin() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("user/login");
        return mv;
    }

    @GetMapping("/register")
    public ModelAndView loadUserRegister() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("user/register");
        return mv;
    }

    @GetMapping("/info")
    public ModelAndView loadUserInfo(HttpSession session) {
        ModelAndView mv = new ModelAndView();

        Long userKey = (Long) session.getAttribute("userKey");
        User user = userService.getUser(userKey);
        mv.addObject("user", user);
        mv.setViewName("user/info");
        return mv;
    }

    @GetMapping("/oauth")
    public ModelAndView oauth(@RequestParam HashMap<String, String> request) {
        ModelAndView mv = new ModelAndView();
        String code = request.get("code");

            // Kakao API에 요청을 보내 액세스 토큰을 받습니다.
            String tokenUrl = "https://kauth.kakao.com/oauth/token";
            RestTemplate restTemplate = new RestTemplate();
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", "347a5f90cc44471068b6858fc5139c7f");
            params.add("redirect_uri", "http://localhost/oauth");
            params.add("code", code);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);

            ResponseEntity<Map> responseEntity = restTemplate.exchange(tokenUrl, HttpMethod.POST, requestEntity, Map.class);
            Map<String, String> responseBody = responseEntity.getBody();

            String access_token = responseBody.get("access_token");



        mv.addObject("access_token", access_token);

        mv.setViewName("user/oauth");

        return mv;
    }

    @GetMapping("/kakao")
    public ModelAndView kakao(@RequestParam HashMap<String, String> request) {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("user/kakao");

        return mv;
    }

    @PostMapping("/logout")
    @ResponseBody
    public HashMap<String, Object> logout(HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();
        sessionService.invalidateSession(session);

        response.put("status", true);
        response.put("message", "로그아웃 되었습니다.");
        return response;
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
}
