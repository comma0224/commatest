package com.comma.repository;

import com.comma.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByMemberLevelIn(List<String> memberLevels);

    @Query("SELECT c FROM Category c WHERE c.memberLevel IN :memberLevels AND c.isActive = true")
    List<Category> findByMemberLevelInAndIsActive(@Param("memberLevels") List<String> memberLevels);
}