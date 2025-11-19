package org.unibl.etf.pisio.analyticsservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.pisio.analyticsservice.dto.DailyCountDTO;
import org.unibl.etf.pisio.analyticsservice.dto.LocationPointDTO;
import org.unibl.etf.pisio.analyticsservice.dto.TopLocationDTO;
import org.unibl.etf.pisio.analyticsservice.service.AnalyticsService;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/time/24h")
    public long count24h() {
        return analyticsService.countLast24Hours();
    }

    @GetMapping("/time/7d")
    public long count7d() {
        return analyticsService.countLast7Days();
    }

    @GetMapping("/time/30d")
    public long count30d() {
        return analyticsService.countLast30Days();
    }

    @GetMapping("/time/daily")
    public List<DailyCountDTO> daily() {
        return analyticsService.dailyCounts();
    }

    @GetMapping("/time/total")
    public long total() {
        return analyticsService.totalIncidents();
    }

    @GetMapping("/location/top")
    public List<TopLocationDTO> topLocations() {
        return analyticsService.topLocations();
    }

    @GetMapping("/location/points")
    public List<LocationPointDTO> getPoints() {
        return analyticsService.getAllPoints();
    }

    @GetMapping("/location/radius")
    public long countInRadius(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radiusMeters
    ) {
        return analyticsService.countInRadius(lat, lng, radiusMeters);
    }
}