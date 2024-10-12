package com.comma.domain.shelter;

import java.sql.Timestamp;

public class CommentWithLikes {
    private Long commentKey;
    private Long parentCommentKey;
    private String content;
    private String nickname;
    private Long likeCount;
    private Timestamp createdAt;

    // Constructor
    public CommentWithLikes(Long commentKey,Long parentCommentKey, String content, Timestamp createdAt, String nickname, Long likeCount) {
        this.commentKey = commentKey;
        this.parentCommentKey = parentCommentKey;
        this.content = content;
        this.nickname = nickname;
        this.likeCount = likeCount;
        this.createdAt = createdAt;

    }
    public Long getCommentKey() {
        return commentKey;
    }

    public void setCommentKey(Long commentKey) {
        this.commentKey = commentKey;
    }


    public Long getParentCommentKey() {
        return parentCommentKey;
    }

    public void setParentCommentKey(Long parentCommentKey) {
        this.parentCommentKey = parentCommentKey;
    }

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public Long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Long likeCount) {
        this.likeCount = likeCount;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}