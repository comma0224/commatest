package com.comma.service;

import com.comma.domain.Category;
import com.comma.handler.AdminHandler;
import com.comma.repository.CategoryRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Cacheable(value = "categories", key = "#session.getAttribute('memberLevel')")
    public List<Category> getCategoriesByMemberLevel(HttpSession session) {

        String memberLevel = (String) session.getAttribute("memberLevel");
        if (memberLevel == null) {
            memberLevel = "guest";
        }

        switch (memberLevel) {
            case "guest":
                return categoryRepository.findByMemberLevelInAndIsActive(List.of("guest", "member", "moderator", "admin"));
            case "member":
                return categoryRepository.findByMemberLevelInAndIsActive(List.of("guest", "member", "moderator", "admin"));
            case "moderator":
                return categoryRepository.findByMemberLevelInAndIsActive(List.of("guest", "member", "moderator", "admin"));
            case "admin":
                return categoryRepository.findByMemberLevelInAndIsActive(List.of("guest", "member", "moderator", "admin"));
            default:
                return categoryRepository.findByMemberLevelInAndIsActive(List.of("guest"));
        }
    }

    public void saveAll(List<Category> categories, HttpSession session) throws Exception {
        String memberId = (String) session.getAttribute("memberId");
        categories.forEach(category -> newCategoryUpdate(category, memberId));

        try {
            categoryRepository.saveAll(categories);
        } catch (Exception e) {
            throw new Exception("저장에 실패하였습니다.", e);
        }
        AdminHandler.sendCategoryUpdate();
    }

    private void newCategoryUpdate(Category category, String memberId) {
        if (category.getCreatedAt() == null) {
            category.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        }
        if (category.getUpdatedAt() == null) {
            category.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        }
        if (category.getCreatedBy() == null || category.getCreatedBy().isEmpty()) {
            category.setCreatedBy(memberId);
        }
        if (category.getUpdatedBy() == null || category.getUpdatedBy().isEmpty()) {
            category.setUpdatedBy(memberId);
        }
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }
}