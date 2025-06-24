export class RsaHelper {
  static BEGIN_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----";
  static END_PRIVATE_KEY = "-----END PRIVATE KEY-----";
  static BEGIN_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----";
  static END_PUBLIC_KEY = "-----END PUBLIC KEY-----";
  static HASH_ALGORITHM = "SHA-256";
  static SIGNATURE_ALGORITHM = "RSASSA-PKCS1-v1_5";

  static async generateKeyPair(modulusLength: number = 2048) {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: RsaHelper.SIGNATURE_ALGORITHM,
        modulusLength: modulusLength,
        publicExponent: new Uint8Array([1, 0, 1]), // 65537
        hash: RsaHelper.HASH_ALGORITHM,
      },
      true, // extractable
      ["sign", "verify"]
    );

    // Convert to PEM format
    const publicKey = await window.crypto.subtle.exportKey(
      "spki",
      keyPair.publicKey
    );
    const privateKey = await window.crypto.subtle.exportKey(
      "pkcs8",
      keyPair.privateKey
    );

    // Convert ArrayBuffer to base64 string
    const publicKeyBase64 = btoa(
      String.fromCharCode(...new Uint8Array(publicKey))
    );
    const privateKeyBase64 = btoa(
      String.fromCharCode(...new Uint8Array(privateKey))
    );

    // Format as PEM
    const publicKeyPem = `${RsaHelper.BEGIN_PUBLIC_KEY}\n${publicKeyBase64}\n${RsaHelper.END_PUBLIC_KEY}`;
    const privateKeyPem = `${RsaHelper.BEGIN_PRIVATE_KEY}\n${privateKeyBase64}\n${RsaHelper.END_PRIVATE_KEY}`;

    return {
      publicKey: publicKeyPem,
      privateKey: privateKeyPem,
    };
  }

  static async sign(hashValue: string, privateKeyPem: string): Promise<string> {
    try {
      // Remove PEM header/footer and convert base64 to binary
      const pemContents = privateKeyPem
        .replace(RsaHelper.BEGIN_PRIVATE_KEY, "")
        .replace(RsaHelper.END_PRIVATE_KEY, "")
        .replace(/\s/g, "");

      // Import the private key
      const binaryDer = window.atob(pemContents);
      const der = new Uint8Array(binaryDer.length);
      for (let i = 0; i < binaryDer.length; i++) {
        der[i] = binaryDer.charCodeAt(i);
      }

      const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        der,
        {
          name: RsaHelper.SIGNATURE_ALGORITHM,
          hash: { name: RsaHelper.HASH_ALGORITHM },
        },
        false,
        ["sign"]
      );

      // Convert string to ArrayBuffer using TextEncoder
      const encoder = new TextEncoder();
      const hashBuffer = encoder.encode(hashValue);

      // Sign the hash with RSASSA-PKCS1-v1_5
      const signature = await window.crypto.subtle.sign(
        {
          name: RsaHelper.SIGNATURE_ALGORITHM,
        },
        privateKey,
        hashBuffer
      );

      // Convert signature to base64
      const signatureBase64 = btoa(
        String.fromCharCode(...new Uint8Array(signature))
      );

      return signatureBase64;
    } catch (error) {
      console.error("Error signing hash:", error);
      throw error; // Throw the original error for better debugging
    }
  }
}
