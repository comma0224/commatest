// UserSuspension.java
package com.comma.domain.user;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "user_suspension")
public class UserSuspension {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "suspension_key")
    private Long suspensionKey;

    @Column(name = "user_key", nullable = false)
    private Long userKey;

    @Column(name = "title", length = 255, nullable = false)
    private String title = "";

    @Column(name = "reason", nullable = false)
    private String reason = "";

    @Column(name = "start_date", nullable = false)
    private Timestamp startDate = new Timestamp(System.currentTimeMillis());

    @Column(name = "end_date", nullable = false)
    private Timestamp endDate = new Timestamp(System.currentTimeMillis());

    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
    }

    // Getters and Setters
    public Long getSuspensionKey() {
        return suspensionKey;
    }

    public void setSuspensionKey(Long suspensionKey) {
        this.suspensionKey = suspensionKey;
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

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Timestamp getStartDate() {
        return startDate;
    }

    public void setStartDate(Timestamp startDate) {
        this.startDate = startDate;
    }

    public Timestamp getEndDate() {
        return endDate;
    }

    public void setEndDate(Timestamp endDate) {
        this.endDate = endDate;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}