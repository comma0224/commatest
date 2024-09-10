package com.comma.service;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public class SessionService {

    public void invalidateSession(HttpSession session) {
        if (session != null) {
            session.invalidate();
        }
    }

    public Boolean checkLogin(HttpSession session) {
        return Boolean.TRUE.equals(session.getAttribute("isLoggedIn"));
    }
}