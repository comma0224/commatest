// MemberServiceTest.java
package com.comma.service;

import com.comma.domain.Member;
import com.comma.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private MemberService memberService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRegisterMember_Success() throws Exception {
        // Arrange
        String memberId = "testUser";
        String passwordHash = "Test@1234";
        when(memberRepository.existsById(memberId)).thenReturn(false);
        when(memberRepository.existsByMemberCode(any())).thenReturn(false);

        // Act
        memberService.registerMember(memberId, passwordHash);

        // Assert
        verify(memberRepository, times(1)).save(any(Member.class));
    }

    @Test
    public void testRegisterMember_MemberIdNull() {
        // Arrange
        String memberId = null;
        String passwordHash = "Test@1234";

        // Act & Assert
        assertThrows(Exception.class, () -> memberService.registerMember(memberId, passwordHash));
    }

    @Test
    public void testRegisterMember_MemberIdEmpty() {
        // Arrange
        String memberId = "";
        String passwordHash = "Test@1234";

        // Act & Assert
        assertThrows(Exception.class, () -> memberService.registerMember(memberId, passwordHash));
    }

    @Test
    public void testRegisterMember_InvalidMemberId() {
        // Arrange
        String memberId = "user";
        String passwordHash = "Test@1234";

        // Act & Assert
        assertThrows(Exception.class, () -> memberService.registerMember(memberId, passwordHash));
    }

    @Test
    public void testRegisterMember_PasswordHashNull() {
        // Arrange
        String memberId = "testUser";
        String passwordHash = null;

        // Act & Assert
        assertThrows(Exception.class, () -> memberService.registerMember(memberId, passwordHash));
    }

    @Test
    public void testRegisterMember_PasswordHashEmpty() {
        // Arrange
        String memberId = "testUser";
        String passwordHash = "";

        // Act & Assert
        assertThrows(Exception.class, () -> memberService.registerMember(memberId, passwordHash));
    }

    @Test
    public void testRegisterMember_InvalidPasswordHash() {
        // Arrange
        String memberId = "testUser";
        String passwordHash = "password";

        // Act & Assert
        assertThrows(Exception.class, () -> memberService.registerMember(memberId, passwordHash));
    }

    @Test
    public void testRegisterMember_MemberIdExists() {
        // Arrange
        String memberId = "testUser";
        String passwordHash = "Test@1234";
        when(memberRepository.existsById(memberId)).thenReturn(true);

        // Act & Assert
        assertThrows(Exception.class, () -> memberService.registerMember(memberId, passwordHash));
    }
}