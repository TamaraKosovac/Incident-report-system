package org.unibl.etf.pisio.incidentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentStatus;

@Data
@AllArgsConstructor
public class IncidentNlpResponse {
    private IncidentStatus status;
}