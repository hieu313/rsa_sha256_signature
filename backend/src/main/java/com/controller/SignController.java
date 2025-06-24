package com.controller;

import com.dto.request.sign.CreateDocumentRequest;
import com.dto.request.sign.VerifySignatureRequest;
import com.dto.response.ApiResponse;
import com.dto.response.CreateDocumentResponse;
import com.dto.response.ErrorResponse;
import com.dto.response.SignResponse;
import com.model.Document;
import com.model.DocumentSignature;
import com.model.PublicKey;
import com.model.User;
import com.service.DocumentService;
import com.service.DocumentSignatureService;
import com.service.PublicKeyService;
import com.util.SecurityUtils;
import com.util.KeyUtils;
import com.util.RSAUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;

@RestController
@RequestMapping("/api/sign")
@RequiredArgsConstructor
public class SignController {
    private final DocumentService documentService;
    private final DocumentSignatureService documentSignatureService;
    private final PublicKeyService publicKeyService;

    @PostMapping(value = "/create-document", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> createDocument(@ModelAttribute CreateDocumentRequest request) throws IOException, NoSuchAlgorithmException {
        try {
            User user = SecurityUtils.getCurrentUser();
            Document document = documentService.createDocument(request, user);
            DocumentSignature signature = documentSignatureService.createPendingSignature(document, user);
            String hashValueBase64 = Base64.getEncoder().encodeToString(signature.getDocumentHash());
            return ResponseEntity.ok(CreateDocumentResponse.of(hashValueBase64, signature.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ErrorResponse.badRequest(e.getMessage()));
        }
    }

    @PostMapping("/verify-signature")
    public ResponseEntity<ApiResponse> verifySignature(@RequestBody VerifySignatureRequest request) {
        try {
            // Lấy thông tin người dùng hiện tại
            User currentUser = SecurityUtils.getCurrentUser();

            if (currentUser == null) {
                return ResponseEntity.badRequest()
                    .body(ErrorResponse.badRequest("Người dùng không tồn tại"));
            }

            // Lấy thông tin signature từ sessionId
            DocumentSignature signature = documentSignatureService.getSignatureById(request.getSessionId());
            if (signature == null) {
                return ResponseEntity.badRequest()
                    .body(ErrorResponse.badRequest("Không tìm thấy phiên ký"));
            }

            // Kiểm tra trạng thái signature
            if (signature.getStatus() != DocumentSignature.DocumentSignatureStatus.pending) {
                return ResponseEntity.badRequest()
                    .body(ErrorResponse.badRequest("Phiên ký không hợp lệ"));
            }

            // Kiểm tra người ký có phải là người dùng hiện tại không
            if (!signature.getSigner().getId().equals(currentUser.getId())) {
                return ResponseEntity.badRequest()
                    .body(ErrorResponse.badRequest("Bạn không có quyền ký tài liệu này"));
            }

            // Lấy public key
            PublicKey publicKeyEntity = publicKeyService.getPublicKeyById(request.getPublicKeyId());
            if (publicKeyEntity == null) {
                return ResponseEntity.badRequest()
                    .body(ErrorResponse.badRequest("Không tìm thấy public key"));
            }

            // Kiểm tra public key có thuộc về người ký không
            if (!publicKeyEntity.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.badRequest()
                    .body(ErrorResponse.badRequest("Public key không thuộc về bạn"));
            }

            // Kiểm tra public key có bị thu hồi không
            if (publicKeyEntity.isRevoked()) {
                return ResponseEntity.badRequest()
                    .body(ErrorResponse.badRequest("Public key đã bị thu hồi"));
            }

            // Kiểm tra public key có hết hạn không
            if (publicKeyEntity.getExpiresAt() != null && 
                publicKeyEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest()
                    .body(ErrorResponse.badRequest("Public key đã hết hạn"));
            }

            // Kiểm tra hash value
            byte[] originalHash = signature.getDocumentHash();
            byte[] receivedHash = Base64.getDecoder().decode(request.getHashValue());
            if (!java.util.Arrays.equals(originalHash, receivedHash)) {
                return ResponseEntity.badRequest()
                    .body(ErrorResponse.badRequest("Hash value không khớp"));
            }

            // Chuyển đổi PEM sang java.security.PublicKey
            java.security.PublicKey publicKey = KeyUtils.convertPemToPublicKey(publicKeyEntity.getPublicKeyPem());

            // Xác thực chữ ký
            boolean isValid = RSAUtil.verify(
                request.getHashValue(),
                request.getSignValue(),
                publicKey
            );

            if (!isValid) {
                return ResponseEntity.badRequest()
                    .body(ErrorResponse.badRequest("Chữ ký không hợp lệ"));
            }

            // Cập nhật signature
            signature.setStatus(DocumentSignature.DocumentSignatureStatus.completed);
            signature.setSignatureValue(request.getSignValue());
            signature.setSignatureTimestamp(LocalDateTime.parse(request.getSignTimestamp().replace("Z", "")));
            signature.setSigningKey(publicKeyEntity);
            signature.setValid(true);
            documentSignatureService.saveSignature(signature);

            return ResponseEntity.ok(SignResponse.of(signature.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ErrorResponse.badRequest(e.getMessage()));
        }
    }
}
