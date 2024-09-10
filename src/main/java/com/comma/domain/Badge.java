package com.comma.domain;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "badge")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "badge_key")
    private Long badgeKey;

    @Column(name = "name", length = 255, nullable = false, columnDefinition = "VARCHAR(255) DEFAULT ''")
    private String name;

    @Column(name = "price", nullable = false, columnDefinition = "INT DEFAULT 0")
    private int price;

    @Column(name = "tier", length = 1, nullable = false, columnDefinition = "VARCHAR(1) DEFAULT 'D'")
    private String tier;

    @Column(name = "status", length = 10, nullable = false, columnDefinition = "VARCHAR(10) DEFAULT '미판매'")
    private String status;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    public Long getBadgeKey() {
        return badgeKey;
    }

    public void setBadgeKey(Long badgeKey) {
        this.badgeKey = badgeKey;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
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