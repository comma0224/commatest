package com.comma.controller.shelter;

import com.comma.domain.shelter.*;
import com.comma.domain.user.User;
import com.comma.service.shelter.*;
import com.comma.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpSession;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class SectionController {

    @Autowired
    private SectionService sectionService;

    @Autowired
    private UserService userService;

    @Autowired
    private SubSectionService subSectionService;

    @Autowired
    private SubSectionTagService subSectionTagService;

    @Autowired
    private PostService postService;

    @Autowired
    private PostLikeService postLikeService;

    @Autowired
    private SectionAdminService sectionAdminService;

    @Autowired
    private SectionFavoriteService sectionFavoriteService;

    @GetMapping("/shelter/{url}")
    public ModelAndView getSection(@PathVariable String url, HttpSession session) {
        ModelAndView mv = new ModelAndView();

        Section section = sectionService.findByUrl(url);
        Long sectionKey = section.getSectionKey();

        // 세션에서 userKey 가져오기
        Long userKey = (Long) session.getAttribute("userKey");

        if (userKey != null) {
            User user = userService.getUser(userKey);
            mv.addObject("user", user);
        }

        mv.addObject("title", section.getTitle());
        mv.addObject("sectionKey", sectionKey);

        // 관리자 여부 확인
        boolean isAdmin = sectionAdminService.isAdmin(sectionKey, userKey);
        mv.addObject("isAdmin", isAdmin);

        // 즐겨찾기 여부 확인
        boolean isFavorite = sectionFavoriteService.isFavorite(sectionKey, userKey);
        mv.addObject("isFavorite", isFavorite);

        // 서브섹션 목록 가져오기
        List<SubSection> subSections = subSectionService.findBySectionKey(sectionKey);

        Map<String, List<SubSection>> groupedSubSections = subSections.stream()
                .collect(Collectors.groupingBy(SubSection::getTitleGroup));

        mv.addObject("groupedSubSections", groupedSubSections);

        mv.setViewName("shelter/section");
        return mv;
    }

    @PostMapping("/add-on/{url}")
    public ModelAndView getAddOn(@PathVariable String url) {
        ModelAndView mv = new ModelAndView();

        mv.setViewName("add-on/" + url);
        return mv;
    }

    @PostMapping("/new-post")
    public  ModelAndView getNewPost(@RequestBody Map<String, String> request){
        ModelAndView mv = new ModelAndView();
        Long sectionKey = Long.parseLong(request.get("sectionKey"));
        Long subSectionKey = Long.parseLong(request.get("subSectionKey"));
        mv.addObject("sectionKey",sectionKey);
        mv.addObject("subSectionKey",subSectionKey);

        List<SubSectionTag> subSectionTags = subSectionTagService.findBySubSectionKey(subSectionKey);
        mv.addObject("subSectionTags", subSectionTags);

        mv.setViewName("shelter/new-post");
        return mv;
    }

    @PostMapping("/savePost")
    @ResponseBody
    public HashMap<String, Object> savePost(@RequestBody Map<String, String> request, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();

        Long subSectionKey = Long.parseLong(request.get("subSectionKey"));
        Long subSectionTagKey = Long.parseLong(request.get("subSectionTagKey"));
        String title = request.get("title");
        String content = request.get("content");
        Long userKey = (Long) session.getAttribute("userKey");

        try {
            postService.savePost(subSectionKey, subSectionTagKey, userKey, title, content);
            response.put("status", true);
            response.put("message", "저장되었습니다.");
        }catch (Exception e) {
            response.put("status", false);
            response.put("message", "에러가 발생하였습니다.");
        }

        return response;
    }


    @PostMapping("/subsections-management")
    public ModelAndView getSubsectionsManagement(@RequestBody Map<String, String> request) {
        ModelAndView mv = new ModelAndView();
        Long sectionKey = Long.parseLong(request.get("sectionKey"));

        List<SubSection> subSections = subSectionService.findBySectionKey(sectionKey);

        Map<String, List<SubSection>> groupedSubSections = subSections.stream()
                .collect(Collectors.groupingBy(SubSection::getTitleGroup));

        List<SubSectionTag> subSectionTags = new ArrayList<>();
        subSections.forEach(subSection -> {
            subSectionTags.addAll(subSectionTagService.findBySubSectionKey(subSection.getSubSectionKey()));
        });

        mv.addObject("groupedSubSections", groupedSubSections);
        mv.addObject("subSections", subSections);
        mv.addObject("subSectionTags", subSectionTags);

        mv.setViewName("shelter/subsections-management");
        return mv;
    }

    @PostMapping("/saveSubSections")
    @ResponseBody
    public ResponseEntity<?> saveSubSections(@RequestBody Map<String, Object> request) {
        List<Map<String, String>> subSections = (List<Map<String, String>>) request.get("subSections");
        List<Map<String, String>> subSectionTags = (List<Map<String, String>>) request.get("subSectionTags");

        Map<String, Long> newSubSectionKeys = new HashMap<>();

        subSectionTags.forEach(subSectionTag -> {
            String subSectionTagKey = subSectionTag.get("subSectionTagKey");
            boolean isDeleted = Boolean.parseBoolean(subSectionTag.get("isDeleted"));
            if (isDeleted) {
                if (subSectionTagKey.matches("\\d+")) {
                    Long key = Long.parseLong(subSectionTagKey);
                    subSectionTagService.deleteSubSectionTag(key);
                } else {
                    subSectionTags.remove(subSectionTag);
                }
            }
        });

        subSections.forEach(subSection -> {
            String subSectionKey = subSection.get("subSectionKey");
            boolean isDeleted = Boolean.parseBoolean(subSection.get("isDeleted"));
            if (isDeleted) {
                if (subSectionKey.matches("\\d+")) {
                    Long key = Long.parseLong(subSectionKey);
                    subSectionService.deleteSubSection(key);
                } else {
                    subSections.remove(subSection);
                }
            }
        });


        subSections.forEach(subSection -> {
            String subSectionKey = subSection.get("subSectionKey");
            String titleGroup = subSection.get("titleGroup");
            String title = subSection.get("title");
            Long sectionKey = Long.parseLong(subSection.get("sectionKey"));

            if (subSectionKey.matches("\\d+")) {
                Long key = Long.parseLong(subSectionKey);
                // Update existing sub-section
                subSectionService.updateSubSection(key, titleGroup, title, sectionKey);
            } else {
                // Save new sub-section
                Long newKey = subSectionService.saveSubSection(titleGroup, title, sectionKey);
                newSubSectionKeys.put(subSectionKey, newKey);
            }
        });

        subSectionTags.forEach(subSectionTag -> {
            String subSectionTagKey = subSectionTag.get("subSectionTagKey");
            String subSectionKey = subSectionTag.get("subSectionKey");
            String title = subSectionTag.get("title");

            if (subSectionTagKey.matches("\\d+")) {
                // Update existing sub-section tag
                Long key = Long.parseLong(subSectionTagKey);
                subSectionTagService.updateSubSectionTag(key, Long.parseLong(subSectionKey), title);
            } else {
                subSectionKey = newSubSectionKeys.get(subSectionKey).toString();
                // Save new sub-section tag
                subSectionTagService.saveSubSectionTag(Long.parseLong(subSectionKey), title);
            }
        });

        return ResponseEntity.ok().build();
    }


    @PostMapping("/subSectionData")
    @ResponseBody
    public HashMap<String, Object> getSubSectionData(@RequestBody Map<String, String> request) {
        HashMap<String, Object> response = new HashMap<>();

        Long subSectionKey = Long.parseLong(request.get("subSectionKey"));
        Long subSectionTagKey = 0L;

            // Fetch subSection tags and posts
            List<SubSectionTag> subSectionTags = subSectionTagService.findBySubSectionKey(subSectionKey);
            response.put("subSectionTags", subSectionTags);

            List<PostWithLikes> postsWithLikes = postService.findPostsWithLikesBySubSectionKeyAndSubSectionTagKey(subSectionKey,subSectionTagKey,1);
            response.put("postsWithLikes", postsWithLikes);

            // 총 페이지 수 가져오기
        long totalPages = postService.getTotalPagesBySubSectionKeyAndSubSectionTagKey(subSectionKey, subSectionTagKey);

            response.put("totalPages",totalPages);

        return response;
    }

    @PostMapping("/subSectionTagData")
    @ResponseBody
    public HashMap<String, Object> getSubSectionTagData(@RequestBody Map<String, String> request) {
        HashMap<String, Object> response = new HashMap<>();

        Long subSectionKey = Long.parseLong(request.get("subSectionKey"));
        Long subSectionTagKey = Long.parseLong(request.get("subSectionTagKey"));

        // 게시글 목록과 좋아요 합계 가져오기
        List<PostWithLikes> postsWithLikes = postService.findPostsWithLikesBySubSectionKeyAndSubSectionTagKey(subSectionKey,subSectionTagKey,1);
        response.put("postsWithLikes", postsWithLikes);

        long totalPages = postService.getTotalPagesBySubSectionKeyAndSubSectionTagKey(subSectionKey, subSectionTagKey);

        response.put("totalPages",totalPages);

        return response;
    }

    @PostMapping("/postData")
    @ResponseBody
    public HashMap<String, Object> getPostData(@RequestBody Map<String, String> request) {
        HashMap<String, Object> response = new HashMap<>();

        Long subSectionKey = Long.parseLong(request.get("subSectionKey"));
        Long subSectionTagKey = Long.parseLong(request.get("subSectionTagKey"));
        int page = Integer.parseInt(request.get("page"));

        // 게시글 목록과 좋아요 합계 가져오기
        List<PostWithLikes> postsWithLikes = postService.findPostsWithLikesBySubSectionKeyAndSubSectionTagKey(subSectionKey,subSectionTagKey,page);
        response.put("postsWithLikes", postsWithLikes);

        return response;
    }



    @PostMapping("/updateFavoriteStatus")
    @ResponseBody
    public HashMap<String, Object> getUpdateFavoriteStatus(@RequestBody Map<String, String> request,HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();


        Long sectionKey = Long.parseLong(request.get("sectionKey"));
        Long userKey = (Long) session.getAttribute("userKey");

        boolean isFavorite = Boolean.parseBoolean(request.get("isFavorite"));

        if(isFavorite){
            sectionFavoriteService.removeFavorite(sectionKey, userKey);
        }else{
            sectionFavoriteService.addFavorite(sectionKey, userKey);
        }
        response.put("status", true);
        return response;
    }

    @PostMapping("/updatePostLikeStatus")
    @ResponseBody
    public HashMap<String, Object> updatePostLikeStatus(@RequestBody Map<String, String> request,HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();


        Long postKey = Long.parseLong(request.get("postKey"));
        Long userKey = (Long) session.getAttribute("userKey");

        boolean isPostLike = Boolean.parseBoolean(request.get("isPostLike"));

        if(isPostLike){
            postLikeService.removeLike(postKey, userKey);
        }else{
            postLikeService.addLike(postKey, userKey);
        }
        response.put("status", true);
        return response;
    }

    @PostMapping("/post-detail")
    public  ModelAndView getPostDetail(@RequestBody Map<String, String> request,HttpSession session){
        ModelAndView mv = new ModelAndView();
        Long postKey = Long.parseLong(request.get("postKey"));

        //조회수 업데이트
        postService.updateViews(postKey);

        //postKey로 게시글 가져오기
        PostDetail postDetail = postService.findPostDetailByPostKey(postKey);

        // 세션에서 userKey 가져오기
        Long userKey = (Long) session.getAttribute("userKey");
        Boolean isPostLike = false;
        if (userKey != null) {
            isPostLike = postLikeService.existsByPostKeyAndUserKey(postKey, userKey);
        }

        mv.addObject("postDetail", postDetail);
        mv.addObject("postKey", postKey);
        mv.addObject("isPostLike", isPostLike);

        mv.setViewName("shelter/post-detail");
        return mv;
    }
}