package com.comma.service.section;

import com.comma.repository.Section.PostLikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostLikeService {

    @Autowired
    private PostLikeRepository postLikeRepository;

    public Long countByPostKey(Long postKey) {
        return postLikeRepository.countByPostKey(postKey);
    }
}