package com.comma.repository;

import com.comma.domain.Member;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.annotation.Rollback;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(false)
public class MemberRepositoryTest {

    @Autowired
    private MemberRepository memberRepository;

    @Test
    public void testFindByMemberId() {
        // Given

        // When
        Optional<Member> foundMember = memberRepository.findByMemberId("admin");

        // Then
        assertThat(foundMember).isPresent();
        assertThat(foundMember.get().getMemberId()).isEqualTo("admin");
    }
}