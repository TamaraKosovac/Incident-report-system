package org.unibl.etf.pisio.alertservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.pisio.alertservice.model.AlertRead;
import org.unibl.etf.pisio.alertservice.repository.AlertReadRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AlertReadService {

    private final AlertReadRepository repo;

    public void markAsRead(Long moderatorId, Long alertId) {
        if (!repo.existsByModeratorIdAndAlertId(moderatorId, alertId)) {
            AlertRead read = new AlertRead();
            read.setModeratorId(moderatorId);
            read.setAlertId(alertId);
            read.setReadAt(LocalDateTime.now());
            repo.save(read);
        }
    }

    public boolean isRead(Long moderatorId, Long alertId) {
        return repo.existsByModeratorIdAndAlertId(moderatorId, alertId);
    }
}