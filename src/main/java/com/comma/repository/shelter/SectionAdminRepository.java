package com.comma.repository.shelter;

import com.comma.domain.shelter.SectionAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionAdminRepository extends JpaRepository<SectionAdmin, Long> {
    boolean existsBySectionKeyAndUserKey(Long sectionKey, Long userKey);
}