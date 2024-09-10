package com.comma.service;

import com.comma.domain.user.User;
import com.comma.domain.user.UserSuspension;

import com.comma.repository.UserRepository;
import com.comma.repository.UserSuspensionRepository;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSuspensionRepository userSuspensionRepository;

    public void loginUser(String userId, String userPassword, HttpSession session) throws Exception {
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new Exception("존재하지 않는 아이디입니다."));


        if (!user.getStatus().equals("정상")) {
            HashMap<String, Object> response = new HashMap<>();
            UserSuspension userSuspension = userSuspensionRepository.findByUserKey(user.getUserKey());
            String title = userSuspension.getTitle();
            String reason = userSuspension.getReason();
            String startDate = String.valueOf(userSuspension.getStartDate());
            String endDate = String.valueOf(userSuspension.getEndDate());
            throw new Exception(title + " 사유: " + reason + " 시작일: " + startDate + " 종료일: " + endDate);
        }

        if (!user.getUserPassword().equals(userPassword)) {
            throw new Exception("비밀번호가 일치하지 않습니다.");
        }

        session.setAttribute("userId", user.getUserId());
        session.setAttribute("userKey", user.getUserKey());
        session.setAttribute("role", user.getRole());
        session.setAttribute("isLoggedIn", true);

        user.setLastLogin(Timestamp.valueOf(LocalDateTime.now()));
        userRepository.save(user);
    }

    public void registerUser(HashMap<String, String> request) throws Exception {
        String userId = request.get("userId");
        String userPassword = request.get("userPassword");
        String nickname = request.get("nickname");

        // 유효성 검사
        if (userId == null || userId.isEmpty()) {
            throw new Exception("아이디를 입력해 주세요.");
        }
        if (!userId.matches("^[a-zA-Z0-9]{6,}$")) {
            throw new Exception("아이디는 6자리 이상 영문과 숫자만 입력 가능합니다.");
        }
        if (userPassword == null || userPassword.isEmpty()) {
            throw new Exception("비밀번호를 입력해 주세요.");
        }
        if (!userPassword.matches("^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$")) {
            throw new Exception("비밀번호는 8자리 이상 영문, 숫자, 특수문자를 포함해야 합니다.");
        }
        if (isUserIdExists(userId)) {
            throw new Exception("이미 사용중인 아이디입니다.");
        }
        if (nickname == null || nickname.isEmpty()) {
            throw new Exception("별명을 입력해 주세요.");
        }

        // 멤버 객체 생성 및 저장
        User user = new User();
        user.setUserId(userId);
        user.setUserPassword(userPassword);
        user.setNickname(nickname);
        userRepository.save(user);
    }

    public boolean isUserIdExists(String userId) {
        return userRepository.existsByUserId(userId);
    }

    public boolean isNicknameExists(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    public User getUser(Long userKey) {
        User user = userRepository.findById(userKey).orElse(new User());
        // Fetch member information from the database using memberId
        return user;
    }

    public void updateUser(User user, Long userKey) {
        // 기존 회원 정보 가져오기
        User existingUser = getUser(userKey);

        if (user.getNickname() != null && !user.getNickname().isEmpty() && !existingUser.getNickname().equals(user.getNickname())) {
            existingUser.setNickname(user.getNickname());
        }

        if (user.getUserPassword() != null && !user.getUserPassword().isEmpty() && !existingUser.getUserPassword().equals(user.getUserPassword())) {
            existingUser.setUserPassword(user.getUserPassword());
        }

        // 업데이트된 멤버 정보 저장
        userRepository.save(existingUser);
    }

    public void deleteUser(User user, Long userKey) throws Exception {
        User existingUser = getUser(userKey);

        if (!user.getUserPassword().equals(existingUser.getUserPassword())) {
            throw new Exception("비밀번호가 일치하지 않습니다.");
        }

        existingUser.setStatus("탈퇴");

        userRepository.save(existingUser);
    }
}
