package com.comma.repository;

import com.comma.domain.user.UserSuspension;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSuspensionRepository extends JpaRepository<UserSuspension, Long> {
    UserSuspension findByUserKey(Long userKey);
}
