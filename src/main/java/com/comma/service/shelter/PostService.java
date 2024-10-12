package com.comma.service.shelter;

import com.comma.domain.shelter.Post;
import com.comma.domain.shelter.PostDetail;
import com.comma.domain.shelter.PostWithLikes;
import com.comma.repository.shelter.PostRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    private static final int PAGE_SIZE = 30;

    public List<Post> findBySubSectionKey(Long subSectionKey) {
        return postRepository.findBySubSectionKey(subSectionKey);
    }

    public List<PostWithLikes> findPostsWithLikesBySubSectionKeyAndSubSectionTagKey(Long subSectionKey, Long subSectionTagKey, int page){
        int limit = PAGE_SIZE;
        int offset = (page - 1) * PAGE_SIZE;

        if (subSectionTagKey == 0) {
            return postRepository.findPostsWithLikesBySubSectionKey(subSectionKey, limit, offset);
        }
        return postRepository.findPostsWithLikesBySubSectionKeyAndSubSectionTagKey(subSectionKey, subSectionTagKey, limit, offset);
    }

    public long getTotalPagesBySubSectionKeyAndSubSectionTagKey(Long subSectionKey, Long subSectionTagKey) {
        long totalPosts;
        if (subSectionTagKey == 0) {
            totalPosts = postRepository.countPostsBySubSectionKey(subSectionKey);
        }else {
            totalPosts = postRepository.countPostsBySubSectionKeyAndSubSectionTagKey(subSectionKey, subSectionTagKey);
        }

        return (totalPosts + PAGE_SIZE - 1) / PAGE_SIZE; // Calculate total pages
    }

    public void savePost(Long subSectionKey,Long subSectionTagKey,Long userKey,String title,String content) {
        Post post = new Post();
        post.setSubSectionKey(subSectionKey);
        post.setSubSectionTagKey(subSectionTagKey);
        post.setUserKey(userKey);
        post.setTitle(title);
        post.setContent(content);
        post.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));

        postRepository.save(post);
    }

    //조회수 업데이트
    @Transactional
    public void updateViews(Long postKey) {
        postRepository.updateViews(postKey);
    }

    //포스트키로 게시글 조회
    public PostDetail findPostDetailByPostKey(Long postKey) {
        return postRepository.findPostDetailByPostKey(postKey);
    }

}