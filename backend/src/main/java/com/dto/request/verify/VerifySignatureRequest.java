package com.dto.request.verify;

import com.model.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerifySignatureRequest {
    private Document.DocumentType documentType;
    private String textContent;
    private MultipartFile file;
    private String signatureValue;
    private String publicKeyPem;
}
