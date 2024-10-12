package com.comma.repository.shelter;

import com.comma.domain.shelter.Comment;
import com.comma.domain.shelter.CommentWithLikes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT new com.comma.domain.shelter.CommentWithLikes(c.commentKey, c.parentCommentKey, c.content, c.createdAt, u.nickname, COUNT(cl)) " +
            "FROM Comment c " +
            "JOIN User u ON c.userKey = u.userKey " +
            "LEFT JOIN CommentLike cl ON c.commentKey = cl.commentKey " +
            "WHERE c.postKey = :postKey " +
            "GROUP BY c.commentKey " +
            "ORDER BY c.parentCommentKey")
    List<CommentWithLikes> findCommentsByPostKeyWithDetails(Long postKey);
}
