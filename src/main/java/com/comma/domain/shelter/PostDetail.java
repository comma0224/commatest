package com.comma.domain.shelter;

import java.sql.Timestamp;

public class PostDetail {
    private Long postKey;
    private Long subSectionKey;
    private String subSectionTitle;
    private Long subSectionTagKey;
    private String subSectionTagTitle;
    private Long userKey;
    private String nickname;
    private String title;
    private String content;
    private Timestamp createdAt;
    private Long views;
    private Long likeCount;
    private Long commentCount;

    // Getters and Setters
    // Constructor
    public PostDetail(Long postKey, Long subSectionKey, String subSectionTitle, Long subSectionTagKey, String subSectionTagTitle, Long userKey, String nickname, String title, String content, Timestamp createdAt, Long views, Long likeCount,Long commentCount) {
        this.postKey = postKey;
        this.subSectionKey = subSectionKey;
        this.subSectionTitle = subSectionTitle;
        this.subSectionTagKey = subSectionTagKey;
        this.subSectionTagTitle = subSectionTagTitle;
        this.userKey = userKey;
        this.nickname = nickname;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.views = views;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
    }
    public Long getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Long commentCount) {
        this.commentCount = commentCount;
    }

    public Long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Long likeCount) {
        this.likeCount = likeCount;
    }

    public Long getViews() {
        return views;
    }

    public void setViews(Long views) {
        this.views = views;
    }

    public Long getPostKey() {
        return postKey;
    }

    public void setPostKey(Long postKey) {
        this.postKey = postKey;
    }

    public Long getSubSectionKey() {
        return subSectionKey;
    }

    public void setSubSectionKey(Long subSectionKey) {
        this.subSectionKey = subSectionKey;
    }

    public String getSubSectionTitle() {
        return subSectionTitle;
    }

    public void setSubSectionTitle(String subSectionTitle) {
        this.subSectionTitle = subSectionTitle;
    }

    public Long getSubSectionTagKey() {
        return subSectionTagKey;
    }

    public void setSubSectionTagKey(Long subSectionTagKey) {
        this.subSectionTagKey = subSectionTagKey;
    }

    public String getSubSectionTagTitle() {
        return subSectionTagTitle;
    }

    public void setSubSectionTagTitle(String subSectionTagTitle) {
        this.subSectionTagTitle = subSectionTagTitle;
    }

    public Long getUserKey() {
        return userKey;
    }

    public void setUserKey(Long userKey) {
        this.userKey = userKey;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}