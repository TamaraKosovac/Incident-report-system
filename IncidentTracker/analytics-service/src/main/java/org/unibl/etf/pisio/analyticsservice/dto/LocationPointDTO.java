package org.unibl.etf.pisio.analyticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LocationPointDTO {
    private double latitude;
    private double longitude;
}