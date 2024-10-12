package com.comma.service.shelter;

import com.comma.domain.shelter.Comment;
import com.comma.domain.shelter.CommentWithLikes;
import com.comma.repository.shelter.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

        // Update the parentCommentKey if it is 0
        if (comment.getParentCommentKey() == 0) {
            comment.setParentCommentKey(comment.getCommentKey());
            commentRepository.save(comment);
        }
    }

    public List<CommentWithLikes> findCommentsByPostKeyWithDetails(Long postKey) {
        //postKey로 댓글 가져오기 (댓글의 content, userKey의 nickname, commentLike의 카운트)
        List<CommentWithLikes> comments = commentRepository.findCommentsByPostKeyWithDetails(postKey);

        return comments;
    }
}
