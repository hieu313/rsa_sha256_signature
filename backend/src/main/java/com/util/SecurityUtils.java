package com.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import com.model.User;
import com.service.UserService;

@Component
public class SecurityUtils {
    
    private static UserService userService;

    @Autowired
    public SecurityUtils(UserService userService) {
        SecurityUtils.userService = userService;
    }

    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
          return userService.findByEmail(userDetails.getUsername())
                    .orElse(null);
        }
        return null;
    }
} 