package com.comma.repository.Section;

import com.comma.domain.section.SubSectionTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubSectionTagRepository extends JpaRepository<SubSectionTag, Long> {
    List<SubSectionTag> findBySubSectionKey(Long subSectionKey);
}