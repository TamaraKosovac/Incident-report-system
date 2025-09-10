package org.unibl.etf.pisio.incidentservice.model;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String description;
    private String location;
    private String imagePath;

    private LocalDateTime createdAt = LocalDateTime.now();
}
