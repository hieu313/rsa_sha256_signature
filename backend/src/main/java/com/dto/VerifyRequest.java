package com.dto;

public class VerifyRequest {
    private String data;
    private String signature;
    private String publicKey;

    public VerifyRequest() {}

    public VerifyRequest(String data, String signature, String publicKey) {
        this.data = data;
        this.signature = signature;
        this.publicKey = publicKey;
    }

    // Getters và Setters
    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }
}
