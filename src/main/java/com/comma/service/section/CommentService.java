package com.comma.service.section;

import com.comma.domain.section.Comment;
import com.comma.repository.Section.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public void saveComment(Long postKey,Long userKey,String content,Long parentCommentKey) {
        Comment comment = new Comment();
        comment.setPostKey(postKey);
        comment.setUserKey(userKey);
        comment.setContent(content);
        comment.setParentCommentKey(parentCommentKey);


        commentRepository.save(comment);
    }
}
