package com.service;

import org.springframework.stereotype.Service;

import java.security.*;
import java.util.Base64;

@Service
public class SignatureService {

    // Tạo cặp khóa RSA
    public KeyPair generateKeyPair() throws NoSuchAlgorithmException {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        return generator.generateKeyPair();
    }

    // Ký dữ liệu bằng private key
    public String signData(String data, PrivateKey privateKey) throws Exception {
        Signature rsa = Signature.getInstance("SHA256withRSA");
        rsa.initSign(privateKey);
        rsa.update(data.getBytes());
        byte[] signature = rsa.sign();
        return Base64.getEncoder().encodeToString(signature);
    }

    public boolean verifySignature(String data, String signatureStr, PublicKey publicKey) throws Exception {
        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(publicKey);
        sig.update(data.getBytes());

        byte[] signatureBytes = Base64.getDecoder().decode(signatureStr);
        return sig.verify(signatureBytes);
    }

}
