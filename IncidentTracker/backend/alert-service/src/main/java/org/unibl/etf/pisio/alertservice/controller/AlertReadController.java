package org.unibl.etf.pisio.alertservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.pisio.alertservice.service.AlertReadService;

@RestController
@RequestMapping("/api/alert")
@RequiredArgsConstructor
public class AlertReadController {

    private final AlertReadService service;

    @PostMapping("/{alertId}/read")
    public String markAsRead(
            @PathVariable Long alertId,
            @RequestHeader("X-User-Id") Long moderatorId
    ) {
        service.markAsRead(moderatorId, alertId);
        return "OK";
    }
}