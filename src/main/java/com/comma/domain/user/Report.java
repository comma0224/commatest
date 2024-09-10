package com.comma.domain.user;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "report")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_key")
    private Long reportKey;

    @Column(name = "section_key", nullable = false)
    private Long sectionKey;

    @Column(name = "user_key", nullable = false)
    private Long userKey;

    @Column(name = "post_key", nullable = false)
    private Long postKey;

    @Column(name = "comment_key", nullable = false)
    private Long commentKey;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT DEFAULT ''")
    private String reason;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    public Long getReportKey() {
        return reportKey;
    }

    public void setReportKey(Long reportKey) {
        this.reportKey = reportKey;
    }

    public Long getSectionKey() {
        return sectionKey;
    }

    public void setSectionKey(Long sectionKey) {
        this.sectionKey = sectionKey;
    }

    public Long getUserKey() {
        return userKey;
    }

    public void setUserKey(Long userKey) {
        this.userKey = userKey;
    }

    public Long getPostKey() {
        return postKey;
    }

    public void setPostKey(Long postKey) {
        this.postKey = postKey;
    }

    public Long getCommentKey() {
        return commentKey;
    }

    public void setCommentKey(Long commentKey) {
        this.commentKey = commentKey;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}