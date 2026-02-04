package org.unibl.etf.pisio.analyticsservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IncidentDTO {
    private Long id;
    private String type;
    private String subtype;
    private String status;
    private String description;
    private String descriptionEn;
    private LocationDTO location;
    private String imagePath;
    private LocalDateTime createdAt;
    private Long userId;
}