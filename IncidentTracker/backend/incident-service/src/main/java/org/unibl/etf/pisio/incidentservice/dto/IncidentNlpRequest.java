package org.unibl.etf.pisio.incidentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class IncidentNlpRequest {
    private String text;
    private List<String> existing;
}