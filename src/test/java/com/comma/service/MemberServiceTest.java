package com.comma.service;

import com.comma.domain.Member;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class MemberServiceTest {

    MemberService memberService = new MemberService();

    @Test
    void join() {
        //given
        Member member = new Member();
        member.setName("SunJae");

        // when
        Long saveId = memberService.join(member);

        // then
        Member findMember = memberService.findOne(saveId).get();
        assertThat(member.getName()).isEqualTo(findMember.getName());


    }

    @Test
    public void 중복_회원_예제() {
        Member member1= new Member();
        member1.setName("TestName");

        Member member2 = new Member();
        member2.setName("TestName");

        memberService.join(member1);

        /*
        try {
            memberService.join(member2);
        } catch (IllegalStateException e) {
            assertThat(e.getMessage()).isEqualTo("이미 존재하는 회원입니다.");
        }
*/
    }

    @Test
    void findMembers() {
    }

    @Test
    void findOne() {
    }
}