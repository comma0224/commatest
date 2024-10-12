package com.comma.repository.shelter;

import com.comma.domain.shelter.Post;
import com.comma.domain.shelter.PostDetail;
import com.comma.domain.shelter.PostWithLikes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findBySubSectionKey(Long subSectionKey);

    @Query("SELECT new com.comma.domain.shelter.PostWithLikes(p.postKey, p.title, COUNT(DISTINCT pl), COUNT(DISTINCT c), p.views, st.title, u.nickname, p.createdAt) " +
            "FROM Post p " +
            "LEFT JOIN PostLike pl ON p.postKey = pl.postKey " +
            "LEFT JOIN Comment c ON p.postKey = c.postKey " +
            "LEFT JOIN SubSectionTag st ON p.subSectionTagKey = st.subSectionTagKey " +
            "LEFT JOIN User u ON p.userKey = u.userKey " +
            "WHERE p.subSectionKey = :subSectionKey " +
            "GROUP BY p.postKey, p.title, p.views, st.title, u.nickname, p.createdAt " +
            "ORDER BY p.createdAt DESC " +
            "LIMIT :limit OFFSET :offset")
    List<PostWithLikes> findPostsWithLikesBySubSectionKey(@Param("subSectionKey") Long subSectionKey, @Param("limit") int limit, @Param("offset") int offset);

    @Query("SELECT new com.comma.domain.shelter.PostWithLikes(p.postKey, p.title, COUNT(DISTINCT pl), COUNT(DISTINCT c), p.views, st.title, u.nickname, p.createdAt) " +
            "FROM Post p " +
            "LEFT JOIN PostLike pl ON p.postKey = pl.postKey " +
            "LEFT JOIN Comment c ON p.postKey = c.postKey " +
            "LEFT JOIN SubSectionTag st ON p.subSectionTagKey = st.subSectionTagKey " +
            "LEFT JOIN User u ON p.userKey = u.userKey " +
            "WHERE p.subSectionKey = :subSectionKey AND p.subSectionTagKey = :subSectionTagKey " +
            "GROUP BY p.postKey, p.title, p.views, st.title, u.nickname, p.createdAt " +
            "ORDER BY p.createdAt DESC " +
            "LIMIT :limit OFFSET :offset")
    List<PostWithLikes> findPostsWithLikesBySubSectionKeyAndSubSectionTagKey(@Param("subSectionKey") Long subSectionKey, @Param("subSectionTagKey") Long subSectionTagKey, @Param("limit") int limit, @Param("offset") int offset);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.subSectionKey = :subSectionKey")
    long countPostsBySubSectionKey(Long subSectionKey);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.subSectionKey = :subSectionKey AND p.subSectionTagKey = :subSectionTagKey")
    long countPostsBySubSectionKeyAndSubSectionTagKey(Long subSectionKey, Long subSectionTagKey);

    //조회수 업데이트
    @Modifying
    @Query("UPDATE Post p SET p.views = p.views + 1 WHERE p.postKey = :postKey")
    void updateViews(@Param("postKey") Long postKey);

    //key로 게시글 조회
    @Query("SELECT new com.comma.domain.shelter.PostDetail(p.postKey, p.subSectionKey, ss.title, p.subSectionTagKey, sst.title, p.userKey, u.nickname, p.title, p.content, p.createdAt, p.views, COUNT(pl), COUNT(c)) " +
            "FROM Post p " +
            "LEFT JOIN SubSection ss ON p.subSectionKey = ss.subSectionKey " +
            "LEFT JOIN SubSectionTag sst ON p.subSectionTagKey = sst.subSectionTagKey " +
            "LEFT JOIN User u ON p.userKey = u.userKey " +
            "LEFT JOIN PostLike pl ON p.postKey = pl.postKey " +
            "LEFT JOIN Comment c ON p.postKey = c.postKey " +
            "WHERE p.postKey = :postKey " +
            "GROUP BY p.postKey, p.subSectionKey, ss.title, p.subSectionTagKey, sst.title, p.userKey, u.nickname, p.title, p.content, p.createdAt, p.views")
    PostDetail findPostDetailByPostKey(@Param("postKey") Long postKey);
}