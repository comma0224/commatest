package com.comma.domain.section;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "comment_like")
public class CommentLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_key")
    private Long likeKey;

    @Column(name = "comment_key", nullable = false)
    private Long commentKey;

    @Column(name = "user_key", nullable = false)
    private Long userKey;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    public Long getLikeKey() {
        return likeKey;
    }

    public void setLikeKey(Long likeKey) {
        this.likeKey = likeKey;
    }

    public Long getCommentKey() {
        return commentKey;
    }

    public void setCommentKey(Long commentKey) {
        this.commentKey = commentKey;
    }

    public Long getUserKey() {
        return userKey;
    }

    public void setUserKey(Long userKey) {
        this.userKey = userKey;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}