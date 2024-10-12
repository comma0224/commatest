package com.comma.repository.shelter;


import com.comma.domain.shelter.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    //Long findSectionKeyByUrl(String Url);
    //String findTitleByUrl(String Url);
    Section findByUrl(String Url);

    @Query("SELECT s.sectionKey FROM Section s WHERE s.url = :Url")
    Long findSectionKeyByUrl(String Url);

    @Query("SELECT s.title FROM Section s WHERE s.url = :Url")
    String findTitleByUrl(String Url);
}