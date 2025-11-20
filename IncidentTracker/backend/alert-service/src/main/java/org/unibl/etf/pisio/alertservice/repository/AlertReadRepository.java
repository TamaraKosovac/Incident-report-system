package org.unibl.etf.pisio.alertservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.pisio.alertservice.model.AlertRead;

import java.util.List;

public interface AlertReadRepository extends JpaRepository<AlertRead, Long> {

    List<AlertRead> findByModeratorId(Long moderatorId);

    boolean existsByModeratorIdAndAlertId(Long moderatorId, Long alertId);
}