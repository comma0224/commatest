package com.comma.controller.section;

import com.comma.service.section.CommentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    @ResponseBody
    public HashMap<String, Object> SaveComment(@RequestBody Map<String, String> request, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();

        Long postKey = Long.parseLong(request.get("post_key"));
        Long userKey = (Long) session.getAttribute("userKey");
        String content = request.get("content");
        Long parentCommentKey = Long.parseLong(request.get("parent_comment_key"));


        commentService.saveComment(postKey, userKey, content, parentCommentKey);

        return response;
    }
}
