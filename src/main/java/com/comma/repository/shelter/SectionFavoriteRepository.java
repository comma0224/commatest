package com.comma.repository.shelter;

import com.comma.domain.shelter.SectionFavorites;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionFavoriteRepository extends JpaRepository<SectionFavorites, Long> {
    boolean existsBySectionKeyAndUserKey(Long sectionKey, Long userKey);
    void deleteBySectionKeyAndUserKey(Long sectionKey, Long userKey);
}