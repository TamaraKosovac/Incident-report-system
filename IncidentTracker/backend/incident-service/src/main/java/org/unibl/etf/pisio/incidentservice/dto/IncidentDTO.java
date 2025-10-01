package org.unibl.etf.pisio.incidentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IncidentDTO {
    private String text;
    private Double latitude;
    private Double longitude;
    private String createdAt;
}