package org.unibl.etf.pisio.alertservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime detectedAt;
    private Integer incidentCount;
    private Double centerLat;
    private Double centerLng;
    private String message;
    private String signature;
}