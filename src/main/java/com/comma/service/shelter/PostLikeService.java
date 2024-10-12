package com.comma.service.shelter;

import com.comma.domain.shelter.PostLike;
import com.comma.domain.shelter.SectionFavorites;
import com.comma.repository.shelter.PostLikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Service
public class PostLikeService {

    @Autowired
    private PostLikeRepository postLikeRepository;

    public Long countByPostKey(Long postKey) {
        return postLikeRepository.countByPostKey(postKey);
    }

    public Boolean existsByPostKeyAndUserKey(Long postKey, Long userKey) {
        return postLikeRepository.existsByPostKeyAndUserKey(postKey, userKey);
    }

    public void addLike(Long postKey, Long userKey) {
        PostLike postLike = new PostLike();

        postLike.setPostKey(postKey);
        postLike.setUserKey(userKey);
        postLike.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));

        postLikeRepository.save(postLike);
    }

    @Transactional
    public void removeLike(Long postKey, Long userKey) {
        postLikeRepository.deleteByPostKeyAndUserKey(postKey, userKey);
    }
}