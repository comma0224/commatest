package com.comma.controller;

import com.comma.domain.Category;
import com.comma.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

import java.util.HashMap;
import java.util.List;

@RestController
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/categories")
    @ResponseBody
    public List<Category> getCategories(HttpSession session) {
        return categoryService.getCategoriesByMemberLevel(session);
    }

    @PostMapping("/categoriesAll")
    @ResponseBody
    public List<Category> getCategoriesAll() {
        return categoryService.findAll();
    }

    @PostMapping("/categoriesSave")
    @ResponseBody
    public HashMap<String,Object> saveCategories(@RequestBody List<Category> categories, HttpSession session) {
        HashMap<String,Object> response = new HashMap<>();
        try {
            categoryService.saveAll(categories, session);

            response.put("status", true);
            response.put("message", "카테고리 업데이트가 완료되었습니다.");
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", "카테고리 업데이트에 실패했습니다.");
        }

        return response;
    }
}