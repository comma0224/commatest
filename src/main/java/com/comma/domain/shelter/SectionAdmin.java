package com.comma.domain.shelter;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "section_admin")
public class SectionAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "section_admin_key")
    private Long sectionAdminKey;

    @Column(name = "section_key", nullable = false)
    private Long sectionKey;

    @Column(name = "user_key", nullable = false)
    private Long userKey;

    @Column(name = "admin_level", length = 50, nullable = false, columnDefinition = "VARCHAR(50) DEFAULT ''")
    private String adminLevel;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    public Long getSectionAdminKey() {
        return sectionAdminKey;
    }

    public void setSectionAdminKey(Long sectionAdminKey) {
        this.sectionAdminKey = sectionAdminKey;
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

    public String getAdminLevel() {
        return adminLevel;
    }

    public void setAdminLevel(String adminLevel) {
        this.adminLevel = adminLevel;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}