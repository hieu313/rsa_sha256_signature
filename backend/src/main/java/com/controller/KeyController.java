// KeyController.java - Quản lý khóa công khai (Public Key)
package com.controller;

import com.model.KeyRecord;
import com.repository.KeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/keys")
public class KeyController {

    @Autowired
    private KeyRepository keyRepository;

    @PostMapping("/upload")
    public String uploadKey(@RequestBody KeyRecord key) {
        keyRepository.save(key);
        return "Uploaded";
    }

    @GetMapping
    public List<KeyRecord> getAllKeys() {
        return keyRepository.findAll();
    }

    @PatchMapping("/{id}")
    public String updateKey(@PathVariable Long id, @RequestBody KeyRecord updatedKey) {
        KeyRecord key = keyRepository.findById(id).orElseThrow();
        key.setKeyTitle(updatedKey.getKeyTitle());
        key.setDefault(updatedKey.isDefault());
        keyRepository.save(key);
        return "Updated";
    }

    @DeleteMapping("/{id}")
    public String revokeKey(@PathVariable Long id) {
        keyRepository.deleteById(id);
        return "Revoked";
    }
}
