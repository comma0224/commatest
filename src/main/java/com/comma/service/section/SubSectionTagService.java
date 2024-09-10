package com.comma.service.section;

import com.comma.domain.section.SubSectionTag;
import com.comma.repository.Section.SubSectionTagRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubSectionTagService {

    @Autowired
    private SubSectionTagRepository subSectionTagRepository;

    public List<SubSectionTag> findBySubSectionKey(Long subSectionKey) {
        return subSectionTagRepository.findBySubSectionKey(subSectionKey);
    }

    public void updateSubSectionTag(Long subSectionTagKey, Long subSectionKey, String title) {
        SubSectionTag subSectionTag = subSectionTagRepository.findById(subSectionTagKey).orElse(null);
        if (subSectionTag != null) {
            subSectionTag.setSubSectionKey(subSectionKey);
            subSectionTag.setTitle(title);
            subSectionTagRepository.save(subSectionTag);
        }
    }

    public Long saveSubSectionTag(Long subSectionKey, String title) {
        SubSectionTag subSectionTag = new SubSectionTag();
        subSectionTag.setSubSectionKey(subSectionKey);
        subSectionTag.setTitle(title);
        subSectionTag.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        subSectionTagRepository.save(subSectionTag);
        return subSectionTag.getSubSectionTagKey();
    }

    @Transactional
    public void deleteSubSectionTag(Long subSectionTagKey) {
        subSectionTagRepository.deleteById(subSectionTagKey);
    }
}