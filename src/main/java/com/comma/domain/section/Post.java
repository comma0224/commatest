package com.comma.domain.section;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_key")
    private Long postKey;

    @Column(name = "sub_section_key", nullable = false)
    private Long subSectionKey;

    @Column(name = "sub_section_tag_key", nullable = false)
    private Long subSectionTagKey;

    @Column(name = "user_key", nullable = false)
    private Long userKey;

    @Column(name = "title", length = 255, nullable = false, columnDefinition = "VARCHAR(255) DEFAULT ''")
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT DEFAULT ''")
    private String content;

    @Column(name = "views", nullable = false, columnDefinition = "BIGINT DEFAULT 0")
    private Long views = 0L;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

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

    public Long getSubSectionTagKey() {
        return subSectionTagKey;
    }

    public void setSubSectionTagKey(Long subSectionTagKey) {
        this.subSectionTagKey = subSectionTagKey;
    }

    public Long getUserKey() {
        return userKey;
    }

    public void setUserKey(Long userKey) {
        this.userKey = userKey;
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

    public Long getViews() {
        return views;
    }

    public void setViews(Long views) {
        this.views = views;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}