// DocumentController.java - Xem và tải xuống tài liệu đã ký
package com.controller;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @GetMapping("/{id}")
    public String viewDocument(@PathVariable Long id) {
        // Mô phỏng nội dung tài liệu
        return "Document info with ID: " + id;
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<InputStreamResource> downloadDocument(@PathVariable Long id) throws Exception {
        File file = new File("signed_docs/" + id + ".zip");
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + file.getName())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
