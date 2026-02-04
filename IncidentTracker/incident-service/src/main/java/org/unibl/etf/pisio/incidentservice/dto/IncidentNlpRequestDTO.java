package org.unibl.etf.pisio.incidentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class IncidentNlpRequestDTO {
    private IncidentDTO newIncident;
    private List<IncidentDTO> existing;
}