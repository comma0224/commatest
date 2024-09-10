package com.comma.domain.section;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "sub_section")
public class SubSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sub_section_key")
    private Long subSectionKey;

    @Column(name = "section_key", nullable = false)
    private Long sectionKey;

    @Column(name = "title_group", length = 50, nullable = false, columnDefinition = "VARCHAR(50) DEFAULT ''")
    private String titleGroup;

    @Column(name = "title", length = 255, nullable = false, columnDefinition = "VARCHAR(255) DEFAULT ''")
    private String title;

    @Column(name = "url", length = 255, nullable = false, columnDefinition = "VARCHAR(255) DEFAULT ''")
    private String url;

    @Column(name = "status", length = 10, nullable = false, columnDefinition = "VARCHAR(10) DEFAULT '사용'")
    private String status;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    public Long getSubSectionKey() {
        return subSectionKey;
    }

    public void setSubSectionKey(Long subSectionKey) {
        this.subSectionKey = subSectionKey;
    }

    public Long getSectionKey() {
        return sectionKey;
    }

    public void setSectionKey(Long sectionKey) {
        this.sectionKey = sectionKey;
    }

    public String getTitleGroup() {
        return titleGroup;
    }

    public void setTitleGroup(String titleGroup) {
        this.titleGroup = titleGroup;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}