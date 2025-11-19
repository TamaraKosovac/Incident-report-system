package org.unibl.etf.pisio.analyticsservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.pisio.analyticsservice.client.IncidentClient;
import org.unibl.etf.pisio.analyticsservice.dto.DailyCountDTO;
import org.unibl.etf.pisio.analyticsservice.dto.IncidentDTO;
import org.unibl.etf.pisio.analyticsservice.dto.LocationPointDTO;
import org.unibl.etf.pisio.analyticsservice.dto.TopLocationDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final IncidentClient incidentClient;

    public long countLast24Hours() {
        LocalDateTime from = LocalDateTime.now().minusHours(24);

        return incidentClient.getAllIncidents().stream()
                .filter(i -> i.getCreatedAt() != null && i.getCreatedAt().isAfter(from))
                .count();
    }

    public long countLast7Days() {
        LocalDateTime from = LocalDateTime.now().minusDays(7);

        return incidentClient.getAllIncidents().stream()
                .filter(i -> i.getCreatedAt() != null && i.getCreatedAt().isAfter(from))
                .count();
    }

    public long countLast30Days() {
        LocalDateTime from = LocalDateTime.now().minusDays(30);

        return incidentClient.getAllIncidents().stream()
                .filter(i -> i.getCreatedAt() != null && i.getCreatedAt().isAfter(from))
                .count();
    }

    public List<DailyCountDTO> dailyCounts() {
        int days = 30;

        LocalDate start = LocalDate.now().minusDays(days);

        List<IncidentDTO> incidents = incidentClient.getAllIncidents();

        Map<LocalDate, Long> map = incidents.stream()
                .filter(i -> i.getCreatedAt() != null)
                .filter(i -> !i.getCreatedAt().toLocalDate().isBefore(start))
                .collect(Collectors.groupingBy(
                        i -> i.getCreatedAt().toLocalDate(),
                        Collectors.counting()
                ));

        return map.entrySet().stream()
                .map(e -> new DailyCountDTO(e.getKey().toString(), e.getValue()))
                .sorted(Comparator.comparing(DailyCountDTO::getDate))
                .toList();
    }

    public long totalIncidents() {
        return incidentClient.getAllIncidents().size();
    }

    public List<TopLocationDTO> topLocations() {
        int limit = 5;

        List<IncidentDTO> incidents = incidentClient.getAllIncidents();

        Map<String, Long> grouped = incidents.stream()
                .filter(i -> i.getLocation() != null && i.getLocation().getAddress() != null)
                .collect(Collectors.groupingBy(
                        i -> i.getLocation().getAddress(),
                        Collectors.counting()
                ));

        return grouped.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(limit)
                .map(e -> new TopLocationDTO(e.getKey(), e.getValue()))
                .toList();
    }

    public List<LocationPointDTO> getAllPoints() {
        return incidentClient.getAllIncidents().stream()
                .filter(i -> i.getLocation() != null)
                .filter(i -> i.getLocation().getLatitude() != null && i.getLocation().getLongitude() != null)
                .map(i -> new LocationPointDTO(
                        i.getLocation().getLatitude(),
                        i.getLocation().getLongitude()))
                .toList();
    }

    private double distanceKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon/2) * Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    public long countInRadius(double lat, double lng, double radiusMeters) {
        double radiusKm = radiusMeters / 1000.0;

        return incidentClient.getAllIncidents().stream()
                .filter(i -> i.getLocation() != null)
                .filter(i -> i.getLocation().getLatitude() != null && i.getLocation().getLongitude() != null)
                .filter(i -> distanceKm(
                        lat, lng,
                        i.getLocation().getLatitude(),
                        i.getLocation().getLongitude()
                ) <= radiusKm)
                .count();
    }
}