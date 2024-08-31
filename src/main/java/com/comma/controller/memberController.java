package com.comma.controller;

import com.comma.domain.Member;
import com.comma.service.MemberService;
import com.comma.service.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

@Controller
public class memberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private SessionService sessionService;

    @GetMapping("/member-register")
    public ModelAndView loadMemberRegister() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("members/member-register");
        return mv;
    }

    @GetMapping("/member-login")
    public ModelAndView loadMemberLogin() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("members/member-login");
        return mv;
    }

    @GetMapping("/member-info")
    public ModelAndView loadMemberInfo(HttpSession session) {
        ModelAndView mv = new ModelAndView();
        HashMap<String, Object> sessionCheck = checkSession(session);

        if ((boolean) sessionCheck.get("sessionStatus")) {
            String memberId = (String) session.getAttribute("memberId");
            Member member = memberService.getMemberInfo(memberId);
            mv.addObject("member", member);
            mv.setViewName("members/member-info");
        } else {
            mv.setViewName("index");
        }

        return mv;
    }

    @PostMapping("/update-member-info")
    @ResponseBody
    public HashMap<String, Object> updateMemberInfo(@RequestBody Member member, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();
        String memberId = (String) session.getAttribute("memberId");

        try {
            // 업데이트된 멤버 정보 저장
            memberService.updateMemberInfo(member, memberId);

            // 업데이트된 멤버 정보를 다시 가져와서 응답에 포함
            Member updatedMember = memberService.getMemberInfo(memberId);
            response.put("status", true);
            response.put("message", "회원 정보가 수정되었습니다.");
            response.put("updatedMember", updatedMember);
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", "회원 정보 수정에 실패했습니다.");
        }

        return response;
    }

    @PostMapping("/register")
    @ResponseBody
    public HashMap<String, Object> register(@RequestBody Map<String, String> request) {
        HashMap<String, Object> response = new HashMap<>();
//        //로그인 체크
//        response = checkSession(session);
//        if (response.get("sessionStatus")) {
//            response.put("status", false);
//            response.put("message", response.get("sessionMessage"));
//            return response;
//        }

        try {
            String memberId = request.get("memberId");
            String passwordHash = request.get("passwordHash");
            memberService.registerMember(memberId, passwordHash);

            response.put("status", true);
            response.put("message", "회원가입이 완료되었습니다.");
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/login")
    @ResponseBody
    public HashMap<String, Object> login(@RequestBody Map<String, String> request, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();

        try {
            String memberId = request.get("memberId");
            String passwordHash = request.get("passwordHash");
            memberService.loginMember(memberId, passwordHash, session);

            response.put("status", true);
            response.put("message", "로그인이 완료되었습니다.");
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/check-member-id")
    @ResponseBody
    public HashMap<String, Object> checkMemberId(@RequestBody Map<String, String> request) {
        HashMap<String, Object> response = new HashMap<>();
        boolean exists = memberService.isMemberIdExists(request.get("memberId"));
        response.put("status", exists);
        return response;
    }

    private HashMap<String, Object> checkSession(HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();
        String memberId = (String) session.getAttribute("memberId");

        if (memberId != null) {
            response.put("sessionStatus", true);
            response.put("sessionMessage", "로그인 되어있는 사용자입니다.");
        }else {
            response.put("sessionStatus", false);
            response.put("sessionMessage", "로그인이 필요한 서비스입니다.");
        }
        return response;
    }

    @PostMapping("/update-member-password")
    @ResponseBody
    public HashMap<String, Object> updateMemberPassword(@RequestBody Map<String, String> request, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();
        String memberId = (String) session.getAttribute("memberId");
        String currentPasswordHash = request.get("passwordHash");
        String modifyPasswordHash = request.get("modifyPasswordHash");

        try {
            memberService.updateMemberPassword(memberId, currentPasswordHash, modifyPasswordHash);
            response.put("status", true);
            response.put("message", "비밀번호가 변경되었습니다.");
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", e.getMessage());
        }

        return response;
    }

    @PostMapping("/delete-member")
    @ResponseBody
    public HashMap<String, Object> deleteMember(@RequestBody Map<String, String> request, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();
        String memberId = (String) session.getAttribute("memberId");
        String passwordHash = request.get("passwordHash");

        try {
            memberService.deleteMember(memberId, passwordHash);
            sessionService.invalidateSession(session);
            response.put("status", true);
            response.put("message", "회원 탈퇴가 완료되었습니다.");
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", e.getMessage());
        }

        return response;
    }

    @PostMapping("/check-email")
    @ResponseBody
    public HashMap<String, Object> checkEmail(@RequestBody Map<String, String> request, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();
        String email = request.get("email");
        String memberId = (String) session.getAttribute("memberId");

        if (memberId != null) {
            Member member = memberService.getMemberInfo(memberId);
            if (member.getEmail().equals(email)) {
                response.put("status", true);
                return response;
            }
        }

        boolean exists = memberService.isEmailExists(email);
        response.put("status", !exists);
        return response;
    }

    @GetMapping("/member-logout")
    public ModelAndView logout(HttpSession session) {
        ModelAndView mv = new ModelAndView();
        sessionService.invalidateSession(session);
        mv.setViewName("index");
        return mv;
    }


}
