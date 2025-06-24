package com.service;

import com.dto.request.sign.CreateDocumentRequest;
import com.model.Document;
import com.model.User;
import com.repository.DocumentRepository;
import com.util.HashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    
    @Value("${app.upload.dir:./upload}")
    private String uploadDir;

    public Document createDocument(CreateDocumentRequest request, User user) throws IOException, NoSuchAlgorithmException {
        Document document = new Document();
        document.setDocumentType(request.getDocumentType());
        document.setUser(user);

        if (request.getDocumentType() == Document.DocumentType.file) {
            MultipartFile file = request.getFile();
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            
            // Tạo thư mục upload nếu chưa tồn tại
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Lưu file
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes());
            
            document.setFileName(file.getOriginalFilename());
            document.setFilePath(filePath.toString());
            
            // Tính hash từ nội dung file
            document.setOriginalHash(HashUtil.hashBytes(file.getBytes()));
        } else {
            // Xử lý document dạng text
            document.setTextContent(request.getTextContent());
            byte[] contentBytes = request.getTextContent().getBytes(StandardCharsets.UTF_8);
            document.setOriginalHash(HashUtil.hashBytes(contentBytes));
        }

        return documentRepository.save(document);
    }

    public Optional<Document> findById(UUID id) {
        return documentRepository.findById(id);
    }

    public Page<Document> findByUser(User user, Pageable pageable) {
        return documentRepository.findByUser(user, pageable);
    }

    public Optional<Document> findByOriginalHash(byte[] originalHash) {
        return documentRepository.findByOriginalHash(originalHash);
    }

    public void deleteDocument(Document document) {
        // TODO: Thêm logic xóa file vật lý nếu cần
        documentRepository.delete(document);
    }
} 