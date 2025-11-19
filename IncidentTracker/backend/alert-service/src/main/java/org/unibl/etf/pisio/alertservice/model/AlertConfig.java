package org.unibl.etf.pisio.alertservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class AlertConfig {

    @Id
    private Integer id = 1;

    private Integer radiusMeters;
    private Integer timeWindowMinutes;
    private Integer minIncidents;
    private Integer lookbackDays;
}