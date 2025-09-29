package org.unibl.etf.pisio.incidentservice.repository;

import org.unibl.etf.pisio.incidentservice.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentStatus;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByStatus(IncidentStatus status);
    List<Incident> findByUserId(Long userId);
}