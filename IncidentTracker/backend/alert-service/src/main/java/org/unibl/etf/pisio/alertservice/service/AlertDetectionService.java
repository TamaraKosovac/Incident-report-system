package org.unibl.etf.pisio.alertservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.pisio.alertservice.client.IncidentClient;
import org.unibl.etf.pisio.alertservice.dto.IncidentDTO;
import org.unibl.etf.pisio.alertservice.model.AlertConfig;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertDetectionService {

    private final AlertConfigService configService;
    private final IncidentClient incidentClient;
    private final AlertService alertService;

    public void detect() {
        AlertConfig cfg = configService.getConfig();

        List<IncidentDTO> incidents = incidentClient.getRecentIncidents(cfg.getLookbackDays());

        for (IncidentDTO base : incidents) {

            List<IncidentDTO> cluster = incidents.stream()
                    .filter(i -> isClose(base, i, cfg))
                    .toList();

            if (cluster.size() >= cfg.getMinIncidents()) {

                double centerLat = cluster.stream()
                        .mapToDouble(i -> i.getLocation().getLatitude())
                        .average().orElse(0);

                double centerLng = cluster.stream()
                        .mapToDouble(i -> i.getLocation().getLongitude())
                        .average().orElse(0);

                String message = "Detected " + cluster.size() +
                        " incidents in last " + cfg.getTimeWindowMinutes() +
                        " minutes within " + cfg.getRadiusMeters() + "m.";

                List<Long> ids = cluster.stream()
                        .map(IncidentDTO::getId)
                        .sorted()
                        .toList();

                String idString = String.join("_",
                        ids.stream().map(String::valueOf).toList());

                String signature = "C_" + idString + "_"
                        + cfg.getRadiusMeters() + "_"
                        + cfg.getTimeWindowMinutes();

                if (alertService.existsBySignature(signature)) {
                    System.out.println("DUPLICATE ALERT BLOCKED");
                    continue;
                }

                alertService.createAlert(cluster.size(), centerLat, centerLng, message, signature);
            }
        }
    }

    private boolean isClose(IncidentDTO a, IncidentDTO b, AlertConfig cfg) {

        double latA = a.getLocation().getLatitude();
        double lngA = a.getLocation().getLongitude();

        double latB = b.getLocation().getLatitude();
        double lngB = b.getLocation().getLongitude();

        long minutes = Math.abs(Duration
                .between(a.getCreatedAt(), b.getCreatedAt())
                .toMinutes());

        return minutes <= cfg.getTimeWindowMinutes()
                && distance(latA, lngA, latB, lngB) <= cfg.getRadiusMeters();
    }

    private double distance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}