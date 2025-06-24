package com.dto.response;

import com.dto.response.SuccessResponse;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class CreateDocumentResponse {
    private String hashValue;
    private UUID sessionId;

    public static SuccessResponse<CreateDocumentResponse> of(String hashValue, UUID sessionId) {
        return SuccessResponse.of("Create document success", new CreateDocumentResponse(hashValue, sessionId));
    }
} 