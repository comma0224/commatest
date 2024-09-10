package com.comma.domain.section;

import java.sql.Timestamp;

public class PostWithLikes {
    private Long postKey;
    private String title;
    private Long likeCount;
    private Long commentCount;
    private Long views;
    private String subSectionTag;
    private String nickname;
    private Timestamp createdAt;

    // Constructor
    public PostWithLikes(Long postKey, String title, Long likeCount, Long commentCount, Long views, String subSectionTag, String nickname, Timestamp createdAt) {
        this.postKey = postKey;
        this.title = title;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.views = views;
        this.subSectionTag = subSectionTag;
        this.nickname = nickname;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getPostKey() {
        return postKey;
    }

    public void setPostKey(Long postKey) {
        this.postKey = postKey;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Long likeCount) {
        this.likeCount = likeCount;
    }

    public Long getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Long commentCount) {
        this.commentCount = commentCount;
    }

    public Long getViews() {
        return views;
    }

    public void setViews(Long views) {
        this.views = views;
    }

    public String getSubSectionTag() {
        return subSectionTag;
    }

    public void setSubSectionTag(String subSectionTag) {
        this.subSectionTag = subSectionTag;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}