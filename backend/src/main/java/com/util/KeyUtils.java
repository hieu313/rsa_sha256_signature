package com.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class KeyUtils {
    public static String calculateFingerprint(String publicKeyPem) {
        try {
            // Loại bỏ header, footer và newlines
            String cleanPem = publicKeyPem
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s+", "");

            // Decode base64 để lấy DER format
            byte[] derBytes = Base64.getDecoder().decode(cleanPem);

            // Tính SHA-256 hash
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(derBytes);

            // Convert hash thành hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            return hexString.toString().toUpperCase();
        } catch (NoSuchAlgorithmException | IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid public key PEM format");
        }
    }
} 