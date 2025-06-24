package com.dto.request.sign;

import com.model.Document;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class CreateDocumentRequest {
    private Document.DocumentType documentType;
    private String textContent;
    private MultipartFile file;
} 