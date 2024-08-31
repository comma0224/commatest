package com.comma.service;

import com.comma.domain.Member;
import com.comma.repository.MemberRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 12;
    private SecureRandom random = new SecureRandom();

    public String generateUniqueMemberCode() {
        String memberCode;
        do {
            memberCode = generateMemberCode();
        } while (memberRepository.existsByMemberCode(memberCode));
        return memberCode;
    }

    private String generateMemberCode() {
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return code.toString();
    }

    public void registerMember(String memberId, String passwordHash) throws Exception {
        // 유효성 검사
        if (memberId == null || memberId.isEmpty()) {
            throw new Exception("아이디를 입력해 주세요.");
        }
        if (!memberId.matches("^[a-zA-Z0-9]{6,}$")) {
            throw new Exception("아이디는 6자리 이상 영문과 숫자만 입력 가능합니다.");
        }
        if (passwordHash == null || passwordHash.isEmpty()) {
            throw new Exception("비밀번호를 입력해 주세요.");
        }
        if (!passwordHash.matches("^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$")) {
            throw new Exception("비밀번호는 8자리 이상 영문, 숫자, 특수문자를 포함해야 합니다.");
        }
        if (isMemberIdExists(memberId)) {
            throw new Exception("이미 사용중인 아이디입니다.");
        }

        // 고유한 멤버 코드 생성
        String memberCode = generateUniqueMemberCode();

        // 멤버 객체 생성 및 저장
        Member member = new Member();
        member.setMemberCode(memberCode); // 생성된 멤버 코드 설정
        member.setMemberId(memberId);
        member.setPasswordHash(passwordHash);
        memberRepository.save(member);
    }

    // 아이디 중복 체크
    public boolean isMemberIdExists(String memberId) {
        return memberRepository.existsByMemberId(memberId);
    }

    public void updateMemberInfo(Member member, String memberId) {
        // 기존 회원 정보 가져오기
        Member existingMember = getMemberInfo(memberId);

        // member 객체의 각 필드가 null 또는 빈 값이 아닌 경우에만 existingMember에 설정
        if (member.getMemberName() != null && !member.getMemberName().isEmpty()) {
            existingMember.setMemberName(member.getMemberName());
        }
        if (member.getMemberNickname() != null && !member.getMemberNickname().isEmpty()) {
            existingMember.setMemberNickname(member.getMemberNickname());
        }
        if (member.getEmail() != null && !member.getEmail().isEmpty()) {
            existingMember.setEmail(member.getEmail());
        }
        if (member.getDateOfBirth() != null) {
            existingMember.setDateOfBirth(member.getDateOfBirth());
        }
        if (member.getPhoneNumber() != null && !member.getPhoneNumber().isEmpty()) {
            existingMember.setPhoneNumber(member.getPhoneNumber());
        }
        if (member.getGender() != null) {
            existingMember.setGender(member.getGender());
        }

        // 업데이트된 멤버 정보 저장
        memberRepository.save(existingMember);
    }

    public Member getMemberInfo(String memberId) {
        Member member = memberRepository.findByMemberId(memberId).orElse(new Member());
        // Fetch member information from the database using memberId
        return member;
    }

    public void updateMemberPassword(String memberId, String currentPasswordHash, String modifyPasswordHash) throws Exception {
        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new Exception("존재하지 않는 아이디입니다."));

        if (!member.getPasswordHash().equals(currentPasswordHash)) {
            throw new Exception("현재 비밀번호가 일치하지 않습니다.");
        }

        member.setPasswordHash(modifyPasswordHash);
        memberRepository.save(member);
    }

    public void deleteMember(String memberId, String passwordHash) throws Exception {
        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new Exception("존재하지 않는 아이디입니다."));

        if (!member.getPasswordHash().equals(passwordHash)) {
            throw new Exception("비밀번호가 일치하지 않습니다.");
        }

        member.setIsActive(false);
        memberRepository.save(member);
    }

    public void loginMember(String memberId, String passwordHash, HttpSession session) throws Exception {
        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new Exception("존재하지 않는 아이디입니다."));

        if (member.getIsActive() == false) {
            throw new Exception("탈퇴한 회원입니다.");
        }

        if (!member.getPasswordHash().equals(passwordHash)) {
            throw new Exception("비밀번호가 일치하지 않습니다.");
        }

        session.setAttribute("memberId", member.getMemberId());
        session.setAttribute("memberCode", member.getMemberCode());
        session.setAttribute("isLoggedIn", true);

        member.setLastLogin(Timestamp.valueOf(LocalDateTime.now()));
        memberRepository.save(member);
    }
    public boolean isEmailExists(String email) {
        // Implement the logic to check if the email exists in the database
        return memberRepository.existsByEmail(email);
    }
}