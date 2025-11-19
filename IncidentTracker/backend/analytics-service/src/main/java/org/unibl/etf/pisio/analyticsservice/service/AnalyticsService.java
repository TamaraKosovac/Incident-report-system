package org.unibl.etf.pisio.analyticsservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.pisio.analyticsservice.client.IncidentClient;
import org.unibl.etf.pisio.analyticsservice.dto.IncidentDTO;

import java.time.LocalDateTime;
import java.util.List;

import static java.awt.geom.Point2D.distance;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final IncidentClient incidentClient;

    public long countLast24Hours() {
        List<IncidentDTO> incidents = incidentClient.getAllIncidents();

        LocalDateTime from = LocalDateTime.now().minusHours(24);

        return incidents.stream()
                .filter(i -> i.getCreatedAt() != null && i.getCreatedAt().isAfter(from))
                .count();
    }

    public long countByType(String type) {
        return incidentClient.getAllIncidents().stream()
                .filter(i -> type.equalsIgnoreCase(i.getType()))
                .count();
    }

    public long countNear(double lat, double lng, double radiusMeters) {
        return incidentClient.getAllIncidents().stream()
                .filter(i -> i.getLocation() != null)
                .filter(i -> distance(i.getLocation().getLatitude(), i.getLocation().getLongitude(), lat, lng) <= radiusMeters)
                .count();
    }
}