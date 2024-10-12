package com.comma.domain.shelter;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "section_favorites")
public class SectionFavorites {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_key")
    private Long favoriteKey;

    @Column(name = "user_key", nullable = false)
    private Long userKey;

    @Column(name = "section_key", nullable = false)
    private Long sectionKey;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    public Long getFavoriteKey() {
        return favoriteKey;
    }

    public void setFavoriteKey(Long favoriteKey) {
        this.favoriteKey = favoriteKey;
    }

    public Long getUserKey() {
        return userKey;
    }

    public void setUserKey(Long userKey) {
        this.userKey = userKey;
    }

    public Long getSectionKey() {
        return sectionKey;
    }

    public void setSectionKey(Long sectionKey) {
        this.sectionKey = sectionKey;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}