// KeyRecord.java - Entity cho bảng lưu public key
package com.model;

import jakarta.persistence.*;

@Entity
@Table(name = "keys")
public class KeyRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String keyTitle;

    @Column(length = 2048)
    private String publicKey;

    private boolean isDefault;

    public Long getId() { return id; }
    public String getKeyTitle() { return keyTitle; }
    public void setKeyTitle(String keyTitle) { this.keyTitle = keyTitle; }
    public String getPublicKey() { return publicKey; }
    public void setPublicKey(String publicKey) { this.publicKey = publicKey; }
    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean aDefault) { isDefault = aDefault; }
}
