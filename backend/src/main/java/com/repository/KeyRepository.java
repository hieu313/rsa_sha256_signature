package com.repository;

import com.model.KeyRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KeyRepository extends JpaRepository<KeyRecord, Long> {
}