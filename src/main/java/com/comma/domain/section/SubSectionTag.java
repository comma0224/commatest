package com.comma.domain.section;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "sub_section_tag")
public class SubSectionTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sub_section_tag_key")
    private Long subSectionTagKey;

    @Column(name = "sub_section_key", nullable = false)
    private Long subSectionKey;

    @Column(name = "title", length = 255, nullable = false, columnDefinition = "VARCHAR(255) DEFAULT ''")
    private String title;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    public Long getSubSectionTagKey() {
        return subSectionTagKey;
    }

    public void setSubSectionTagKey(Long subSectionTagKey) {
        this.subSectionTagKey = subSectionTagKey;
    }

    public Long getSubSectionKey() {
        return subSectionKey;
    }

    public void setSubSectionKey(Long subSectionKey) {
        this.subSectionKey = subSectionKey;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}