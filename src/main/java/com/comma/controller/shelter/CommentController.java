package com.comma.controller.shelter;

import com.comma.service.SessionService;
import com.comma.service.shelter.CommentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private SessionService sessionService;

    @PostMapping("/saveComment")
    @ResponseBody
    public HashMap<String, Object> SaveComment(@RequestBody Map<String, String> request, HttpSession session) {
        if (!sessionService.checkLogin(session)) {
            HashMap<String, Object> response = new HashMap<>();
            response.put("status", false);
            response.put("message", "로그인이 필요합니다.");
            return response;
        }
        HashMap<String, Object> response = new HashMap<>();

        Long postKey = Long.parseLong(request.get("postKey"));
        Long userKey = (Long) session.getAttribute("userKey");
        String content = request.get("content");
        Long parentCommentKey = Long.parseLong(request.get("parentCommentKey"));

    try {
        commentService.saveComment(postKey, userKey, content, parentCommentKey);
        //postKey로 댓글 가져오기
    }catch (Exception e){
        response.put("status", false);
        response.put("message", "댓글 등록에 실패했습니다.");
    }

    try {
        response.put("comments", commentService.findCommentsByPostKeyWithDetails(postKey));
        response.put("status", true);
        response.put("message", "댓글이 등록되었습니다.");
    }catch (Exception e) {
        response.put("status", false);
        response.put("message", "댓글을 불러오는데 실패했습니다.");
    }

        return response;
    }

    @PostMapping("/getComments")
    @ResponseBody
    public HashMap<String, Object> getComments(@RequestBody Map<String, String> request) {
        HashMap<String, Object> response = new HashMap<>();

        Long postKey = Long.parseLong(request.get("postKey"));

        try {
            response.put("comments", commentService.findCommentsByPostKeyWithDetails(postKey));
            response.put("status", true);
        }catch (Exception e){
            response.put("status", false);
            response.put("message", "댓글을 불러오는데 실패했습니다.");
        }
        return response;
    }

}
