package com.service;

import com.model.Document;
import com.model.User;
import com.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class DocumentService {
    private final DocumentRepository documentRepository;

    @Autowired
    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public Document createDocument(User user, String fileName, String filePath, byte[] originalHash) {
        if (documentRepository.existsByOriginalHash(originalHash)) {
            throw new IllegalArgumentException("Tài liệu với nội dung này đã tồn tại");
        }

        Document document = new Document();
        document.setUser(user);
        document.setFileName(fileName);
        document.setFilePath(filePath);
        document.setOriginalHash(originalHash);
        document.setStatus("pending");

        return documentRepository.save(document);
    }

    public Optional<Document> findById(UUID id) {
        return documentRepository.findById(id);
    }

    public Page<Document> findByUser(User user, Pageable pageable) {
        return documentRepository.findByUser(user, pageable);
    }

    public Page<Document> findByUserAndStatus(User user, String status, Pageable pageable) {
        return documentRepository.findByUserAndStatus(user, status, pageable);
    }

    public Document updateStatus(Document document, String newStatus) {
        document.setStatus(newStatus);
        return documentRepository.save(document);
    }

    public Optional<Document> findByOriginalHash(byte[] originalHash) {
        return documentRepository.findByOriginalHash(originalHash);
    }

    public void deleteDocument(Document document) {
        // TODO: Thêm logic xóa file vật lý nếu cần
        documentRepository.delete(document);
    }
} 