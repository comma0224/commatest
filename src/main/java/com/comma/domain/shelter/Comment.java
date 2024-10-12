package com.comma.domain.shelter;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_key")
    private Long commentKey;

    @Column(name = "post_key", nullable = false)
    private Long postKey;

    @Column(name = "user_key", nullable = false)
    private Long userKey;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT DEFAULT ''")
    private String content;

    @Column(name = "parent_comment_key")
    private Long parentCommentKey;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Timestamp.valueOf(LocalDateTime.now());
    }

    public Long getCommentKey() {
        return commentKey;
    }

    public void setCommentKey(Long commentKey) {
        this.commentKey = commentKey;
    }

    public Long getPostKey() {
        return postKey;
    }

    public void setPostKey(Long postKey) {
        this.postKey = postKey;
    }

    public Long getUserKey() {
        return userKey;
    }

    public void setUserKey(Long userKey) {
        this.userKey = userKey;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getParentCommentKey() {
        return parentCommentKey;
    }

    public void setParentCommentKey(Long parentCommentKey) {
        this.parentCommentKey = parentCommentKey;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}