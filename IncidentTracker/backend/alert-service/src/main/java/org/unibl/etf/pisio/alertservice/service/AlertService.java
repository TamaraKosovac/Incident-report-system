package org.unibl.etf.pisio.alertservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.pisio.alertservice.model.Alert;
import org.unibl.etf.pisio.alertservice.repository.AlertRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository repo;
    private final AlertReadService alertReadService;

    public Alert createAlert(int incidentCount, double centerLat, double centerLng, String message, String signature) {
        Alert alert = new Alert();
        alert.setDetectedAt(LocalDateTime.now());
        alert.setIncidentCount(incidentCount);
        alert.setCenterLat(centerLat);
        alert.setCenterLng(centerLng);
        alert.setMessage(message);
        alert.setSignature(signature);
        return repo.save(alert);
    }

    public boolean existsBySignature(String signature) {
        return repo.existsBySignature(signature);
    }

    public List<Alert> getAllAlerts() {
        return repo.findAll();
    }

    public List<Alert> getUnreadAlerts(Long moderatorId) {
        List<Alert> all = repo.findAll();
        return all.stream()
                .filter(a -> !alertReadService.isRead(moderatorId, a.getId()))
                .toList();
    }

    public long getUnreadCount(Long moderatorId) {
        return repo.findAll().stream()
                .filter(a -> !alertReadService.isRead(moderatorId, a.getId()))
                .count();
    }

    public void markAsRead(Long moderatorId, Long alertId) {
        alertReadService.markAsRead(moderatorId, alertId);
    }

    public List<Alert> getAlertsAfter(LocalDateTime time) {
        return repo.findByDetectedAtAfter(time);
    }
}