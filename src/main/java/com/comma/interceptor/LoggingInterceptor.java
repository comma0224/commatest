package com.comma.interceptor;

import com.comma.service.LoggingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.security.Principal;

@Component
public class LoggingInterceptor implements HandlerInterceptor {

    @Autowired
    private LoggingService loggingService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        String previousPage = (String) session.getAttribute("previousPage");
        String currentPage = request.getRequestURI();

        // Check if the request is for an HTML page or a controller request
        if ((currentPage.endsWith(".html") || !currentPage.contains(".")) && (previousPage == null || !previousPage.equals(currentPage))) {
            Principal principal = request.getUserPrincipal();
            String username = (principal != null) ? principal.getName() : "anonymous";
            loggingService.logPageVisit(username, currentPage);
            session.setAttribute("previousPage", currentPage);
        }

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // Optional: Add post-handle logic if needed
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // Optional: Add after-completion logic if needed
    }
}