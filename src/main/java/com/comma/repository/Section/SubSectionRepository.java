package com.comma.repository.Section;

import com.comma.domain.section.SubSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubSectionRepository extends JpaRepository<SubSection, Long> {
    List<SubSection> findBySectionKey(Long sectionKey);
    SubSection findBySubSectionKey(Long subSectionKey);
}