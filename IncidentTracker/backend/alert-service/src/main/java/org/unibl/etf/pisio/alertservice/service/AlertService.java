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

    public Alert createAlert(int incidentCount, double centerLat, double centerLng, String message) {
        Alert alert = new Alert();
        alert.setDetectedAt(LocalDateTime.now());
        alert.setIncidentCount(incidentCount);
        alert.setCenterLat(centerLat);
        alert.setCenterLng(centerLng);
        alert.setMessage(message);
        return repo.save(alert);
    }

    public List<Alert> getAllAlerts() {
        return repo.findAll();
    }
}