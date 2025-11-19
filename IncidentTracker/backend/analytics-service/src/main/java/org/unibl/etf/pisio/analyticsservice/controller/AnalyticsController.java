package org.unibl.etf.pisio.analyticsservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.pisio.analyticsservice.dto.DailyCountDTO;
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
    public List<DailyCountDTO> daily(@RequestParam(defaultValue = "30") int days) {
        return analyticsService.dailyCounts(days);
    }

    @GetMapping("/time/total")
    public long total() {
        return analyticsService.totalIncidents();
    }
}