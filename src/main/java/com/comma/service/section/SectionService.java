package com.comma.service.section;


import com.comma.domain.section.Section;
import com.comma.repository.Section.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SectionService {

    @Autowired
    private SectionRepository sectionRepository;

    public Long findSectionKeyByUrl(String url) {
        return sectionRepository.findSectionKeyByUrl(url);
    }

    public String findTitleByUrl(String url) {
        return sectionRepository.findTitleByUrl(url);
    }

    public Section findByUrl(String url) {
        return sectionRepository.findByUrl(url);
    }


}