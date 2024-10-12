package com.comma.repository.shelter;

import com.comma.domain.shelter.SubSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubSectionRepository extends JpaRepository<SubSection, Long> {
    List<SubSection> findBySectionKey(Long sectionKey);
    SubSection findBySubSectionKey(Long subSectionKey);
}