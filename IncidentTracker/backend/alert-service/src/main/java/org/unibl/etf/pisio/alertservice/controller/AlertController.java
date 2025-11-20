package org.unibl.etf.pisio.alertservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.pisio.alertservice.model.Alert;
import org.unibl.etf.pisio.alertservice.service.AlertService;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertService.getAllAlerts();
    }

    @GetMapping("/unread")
    public List<Alert> getUnreadAlerts(@RequestHeader("X-User-Id") Long moderatorId) {
        return alertService.getUnreadAlerts(moderatorId);
    }

    @PostMapping("/{alertId}/read")
    public String markAlertRead(
            @RequestHeader("X-User-Id") Long moderatorId,
            @PathVariable Long alertId
    ) {
        alertService.markAsRead(moderatorId, alertId);
        return "OK";
    }

    @GetMapping("/unread/count")
    public long getUnreadCount(@RequestHeader("X-User-Id") Long moderatorId) {
        return alertService.getUnreadCount(moderatorId);
    }
}