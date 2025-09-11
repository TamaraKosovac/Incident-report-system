package org.unibl.etf.pisio.incidentservice.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class Location {
    private String address;
    private Double latitude;
    private Double longitude;
}
