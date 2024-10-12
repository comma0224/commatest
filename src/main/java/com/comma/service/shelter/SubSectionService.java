package com.comma.service.shelter;

import com.comma.domain.shelter.SubSection;
import com.comma.repository.shelter.SubSectionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubSectionService {

    @Autowired
    private SubSectionRepository subSectionRepository;

    public List<SubSection> findBySectionKey(Long sectionKey) {
        return subSectionRepository.findBySectionKey(sectionKey);
    }

    public SubSection findBySubSectionKey(Long subSectionKey) {
        return subSectionRepository.findBySubSectionKey(subSectionKey);
    }

    public void updateSubSection(Long subSectionKey, String titleGroup, String title, Long sectionKey) {
        SubSection subSection = subSectionRepository.findBySubSectionKey(subSectionKey);
        if (subSection != null) {
            subSection.setTitleGroup(titleGroup);
            subSection.setTitle(title);
            subSection.setSectionKey(sectionKey);
            subSection.setCreatedAt(subSection.getCreatedAt());
            subSectionRepository.save(subSection);
        }
    }

    public Long saveSubSection(String titleGroup, String title, Long sectionKey) {
        SubSection subSection = new SubSection();
        subSection.setTitleGroup(titleGroup);
        subSection.setSectionKey(sectionKey);
        subSection.setStatus("사용");
        subSection.setTitle(title);
        subSection.setUrl("");
        subSection.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));



        subSectionRepository.save(subSection);
        return subSection.getSubSectionKey();
    }

    @Transactional
    public void deleteSubSection(Long subSectionKey) {
        subSectionRepository.deleteById(subSectionKey);
    }

}