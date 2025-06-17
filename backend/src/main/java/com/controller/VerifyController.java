package com.controller;

import com.dto.VerifyRequest;
import com.service.SignatureService;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/verify")
public class VerifyController {

    @Autowired
    private SignatureService signatureService;

    @PostMapping
    public boolean verifySignature(@RequestBody VerifyRequest request) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(request.getPublicKey());
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PublicKey publicKey = keyFactory.generatePublic(keySpec);

        return signatureService.verifySignature(
            request.getData(),
            request.getSignature(),
            publicKey
        );
    }
}

