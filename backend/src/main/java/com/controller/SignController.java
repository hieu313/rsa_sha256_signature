package com.controller;

import com.dto.request.CreateDocumentRequest;
import com.dto.response.ApiResponse;
import com.dto.response.CreateDocumentResponse;
import com.dto.response.ErrorResponse;
import com.model.Document;
import com.model.DocumentSignature;
import com.model.User;
import com.service.DocumentService;
import com.service.DocumentSignatureService;
import com.service.SignatureService;
import com.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@RestController
@RequestMapping("/api/sign")
@RequiredArgsConstructor
public class SignController {
    private final DocumentService documentService;
    private final DocumentSignatureService documentSignatureService;
    private final SignatureService signatureService;

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
}
