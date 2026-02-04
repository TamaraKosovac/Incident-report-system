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
    public List<Alert> getUnreadAlerts(@RequestParam Long moderatorId) {
        return alertService.getUnreadAlerts(moderatorId);
    }

    @PostMapping("/{alertId}/read")
    public String markAlertRead(
            @PathVariable Long alertId,
            @RequestParam Long moderatorId
    ) {
        alertService.markAsRead(moderatorId, alertId);
        return "OK";
    }

    @GetMapping("/unread/count")
    public long getUnreadCount(@RequestParam Long moderatorId) {
        return alertService.getUnreadCount(moderatorId);
    }
}