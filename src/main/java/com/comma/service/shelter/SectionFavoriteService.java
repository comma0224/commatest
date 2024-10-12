package com.comma.service.shelter;

import com.comma.domain.shelter.SectionFavorites;
import com.comma.repository.shelter.SectionFavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Service
public class SectionFavoriteService {

    @Autowired
    private SectionFavoriteRepository sectionFavoriteRepository;

    public boolean isFavorite(Long sectionKey, Long userKey) {
        return sectionFavoriteRepository.existsBySectionKeyAndUserKey(sectionKey, userKey);
    }

    public void addFavorite(Long sectionKey, Long userKey) {
        SectionFavorites sectionFavorite = new SectionFavorites();
        sectionFavorite.setSectionKey(sectionKey);
        sectionFavorite.setUserKey(userKey);
        sectionFavorite.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        sectionFavoriteRepository.save(sectionFavorite);
    }

    @Transactional
    public void removeFavorite(Long sectionKey, Long userKey) {
        sectionFavoriteRepository.deleteBySectionKeyAndUserKey(sectionKey, userKey);
    }
}