package org.unibl.etf.pisio.incidentservice.repository;

import org.unibl.etf.pisio.incidentservice.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
}