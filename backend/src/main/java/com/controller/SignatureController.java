// SignatureController.java - Xử lý các chức năng ký, xác thực, và tạo khóa
package com.controller;

import com.service.SignatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Base64;

@RestController
@RequestMapping("/api/signatures")
public class SignatureController {

    @Autowired
    private SignatureService signatureService;

    private KeyPair currentKeyPair;

    @PostMapping("/generate-keys")
    public String generateKeys() throws Exception {
        currentKeyPair = signatureService.generateKeyPair();
        PublicKey publicKey = currentKeyPair.getPublic();
        return Base64.getEncoder().encodeToString(publicKey.getEncoded());
    }

    @PostMapping("/sign")
    public String sign(@RequestBody String data) throws Exception {
        if (currentKeyPair == null) throw new Exception("KeyPair not initialized");
        PrivateKey privateKey = currentKeyPair.getPrivate();
        return signatureService.signData(data, privateKey);
    }

    @PostMapping("/verify")
    public boolean verify(@RequestParam String data, @RequestParam String signature) throws Exception {
        if (currentKeyPair == null) throw new Exception("KeyPair not initialized");
        PublicKey publicKey = currentKeyPair.getPublic();
        return signatureService.verifySignature(data, signature, publicKey);
    }
}