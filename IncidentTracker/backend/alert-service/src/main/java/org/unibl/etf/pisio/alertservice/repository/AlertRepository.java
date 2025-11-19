package org.unibl.etf.pisio.alertservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.pisio.alertservice.model.Alert;

public interface AlertRepository extends JpaRepository<Alert, Long> { }