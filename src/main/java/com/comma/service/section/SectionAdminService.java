package com.comma.service.section;

import com.comma.repository.Section.SectionAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SectionAdminService {

    @Autowired
    private SectionAdminRepository sectionAdminRepository;

    public boolean isAdmin(Long sectionKey, Long userKey) {
        return sectionAdminRepository.existsBySectionKeyAndUserKey(sectionKey, userKey);
    }
}