package org.unibl.etf.pisio.incidentservice.model;

import jakarta.persistence.*;
import lombok.Data;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentStatus;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentSubtype;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentType;

import java.time.LocalDateTime;

@Entity
@Data
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private IncidentType type;
    @Enumerated(EnumType.STRING)
    private IncidentSubtype subtype;
    @Enumerated(EnumType.STRING)
    private IncidentStatus status = IncidentStatus.REPORTED;
    @Column(length = 1000)
    private String description;
    @Column(length = 1000)
    private String descriptionEn;
    @Embedded
    private Location location;
    private String imagePath;
    private LocalDateTime createdAt = LocalDateTime.now();
    private Long userId;
}
