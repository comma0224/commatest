package com.comma.domain.section;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "section")
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "section_key")
    private Long sectionKey;

    @Column(name = "title", length = 255, nullable = false, columnDefinition = "VARCHAR(255) DEFAULT ''")
    private String title;

    @Column(name = "url", length = 255, nullable = false, columnDefinition = "VARCHAR(255) DEFAULT ''")
    private String url;

    @Column(name = "meta_title", length = 255, nullable = false, columnDefinition = "VARCHAR(255) DEFAULT ''")
    private String metaTitle;

    @Column(name = "meta_description", nullable = false, columnDefinition = "TEXT DEFAULT ''")
    private String metaDescription;

    @Column(name = "status", length = 10, nullable = false, columnDefinition = "VARCHAR(10) DEFAULT '사용'")
    private String status;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    public Long getSectionKey() {
        return sectionKey;
    }

    public void setSectionKey(Long sectionKey) {
        this.sectionKey = sectionKey;
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

    public String getMetaTitle() {
        return metaTitle;
    }

    public void setMetaTitle(String metaTitle) {
        this.metaTitle = metaTitle;
    }

    public String getMetaDescription() {
        return metaDescription;
    }

    public void setMetaDescription(String metaDescription) {
        this.metaDescription = metaDescription;
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