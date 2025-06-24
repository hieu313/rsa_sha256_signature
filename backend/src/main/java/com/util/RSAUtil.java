package com.util;

import java.security.*;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class RSAUtil {
    public static boolean verify(byte[] data, byte[] signature, PublicKey publicKey) throws GeneralSecurityException {
        try {
            Signature publicSignature = Signature.getInstance("SHA256withRSA");
            publicSignature.initVerify(publicKey);
            publicSignature.update(data);
            return publicSignature.verify(signature);
        } catch (GeneralSecurityException e) {
            throw new GeneralSecurityException("Lỗi xác thực chữ ký: " + e.getMessage());
        }
    }

    public static boolean verify(String data, String base64Signature, PublicKey publicKey) throws GeneralSecurityException {
        byte[] dataBytes = data.getBytes();
        byte[] signatureBytes = Base64.getDecoder().decode(base64Signature);
        return verify(dataBytes, signatureBytes, publicKey);
    }
}

