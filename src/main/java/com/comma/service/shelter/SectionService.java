package com.comma.service.shelter;


import com.comma.domain.shelter.Section;
import com.comma.repository.shelter.SectionRepository;
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