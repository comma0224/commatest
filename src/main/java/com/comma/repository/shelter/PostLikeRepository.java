package com.comma.repository.shelter;

import com.comma.domain.shelter.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Long countByPostKey(Long postKey);

    Boolean existsByPostKeyAndUserKey(Long postKey, Long userKey);

    void deleteByPostKeyAndUserKey(Long postKey, Long userKey);
}