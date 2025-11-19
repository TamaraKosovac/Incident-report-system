package org.unibl.etf.pisio.analyticsservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.pisio.analyticsservice.client.IncidentClient;
import org.unibl.etf.pisio.analyticsservice.dto.DailyCountDTO;
import org.unibl.etf.pisio.analyticsservice.dto.IncidentDTO;

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

    public List<DailyCountDTO> dailyCounts(int days) {
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
}