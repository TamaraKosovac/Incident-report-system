package org.unibl.etf.pisio.analyticsservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.pisio.analyticsservice.service.AnalyticsService;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/last24h")
    public long last24h() {
        return analyticsService.countLast24Hours();
    }

    @GetMapping("/count/type/{type}")
    public long countByType(@PathVariable String type) {
        return analyticsService.countByType(type);
    }
}