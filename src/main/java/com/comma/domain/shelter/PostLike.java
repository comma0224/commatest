package com.comma.domain.shelter;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "post_like")
public class PostLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_key")
    private Long likeKey;

    @Column(name = "user_key", nullable = false)
    private Long userKey;

    @Column(name = "post_key", nullable = false)
    private Long postKey;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    public Long getLikeKey() {
        return likeKey;
    }

    public void setLikeKey(Long likeKey) {
        this.likeKey = likeKey;
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

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}