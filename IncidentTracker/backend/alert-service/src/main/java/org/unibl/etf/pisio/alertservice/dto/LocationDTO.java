package org.unibl.etf.pisio.alertservice.dto;

import lombok.Data;

@Data
public class LocationDTO {
    private String address;
    private Double latitude;
    private Double longitude;
}