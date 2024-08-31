package com.comma.repository;

import com.comma.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {
    boolean existsByMemberCode(String memberCode);
    Optional<Member> findByMemberId(String memberId);
    boolean existsByEmail(String email);
    boolean existsByMemberId(String memberId);
}