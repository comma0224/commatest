package com.comma.service.shelter;

import com.comma.repository.shelter.SectionAdminRepository;
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