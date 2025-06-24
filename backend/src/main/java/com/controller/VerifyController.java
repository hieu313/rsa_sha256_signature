package com.controller;

import com.dto.request.verify.VerifySignatureRequest;
import com.dto.response.ApiResponse;
import com.dto.response.ErrorResponse;
import com.dto.response.VerifySignatureResponse;
import com.model.Document;
import com.util.KeyUtils;
import com.util.HashUtil;
import com.util.RSAUtil;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.PublicKey;
import java.util.Base64;

@RestController
@RequestMapping("/api/verify")
public class VerifyController {
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> verify(@ModelAttribute VerifySignatureRequest request) {
        try {
            // Chuyển đổi PEM sang PublicKey object
            PublicKey publicKey = KeyUtils.convertPemToPublicKey(request.getPublicKeyPem());

            // Tính toán hash dựa trên loại document
            byte[] hashBytes;
            if (request.getDocumentType() == Document.DocumentType.text) {
                byte[] contentBytes = request.getTextContent().getBytes(StandardCharsets.UTF_8);
                hashBytes = HashUtil.hashBytes(contentBytes);
            } else {
                MultipartFile file = request.getFile();
                byte[] fileContent = file.getBytes();
                hashBytes = HashUtil.hashBytes(fileContent);
            }

            // Encode hash thành base64 string - giống như trong SignController
            String hashBase64 = Base64.getEncoder().encodeToString(hashBytes);

            // Verify signature sử dụng RSAUtil - giống như trong SignController
            boolean isValid = RSAUtil.verify(
                hashBase64,
                request.getSignatureValue(),
                publicKey
            );

            return ResponseEntity.ok(
                isValid ? VerifySignatureResponse.validSignature()
                       : VerifySignatureResponse.invalidSignature()
            );

        } catch (IllegalArgumentException | GeneralSecurityException | IOException e) {
            return ResponseEntity.badRequest()
                .body(ErrorResponse.badRequest(e.getMessage()));
        }
    }
}