package org.unibl.etf.pisio.alertservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.pisio.alertservice.model.AlertConfig;
import org.unibl.etf.pisio.alertservice.service.AlertConfigService;

@RestController
@RequestMapping("/api/alerts/config")
@RequiredArgsConstructor
public class AlertConfigController {

    private final AlertConfigService service;

    @GetMapping
    public AlertConfig get() {
        return service.getConfig();
    }

    @PutMapping
    public AlertConfig update(@RequestBody AlertConfig config) {
        return service.update(config);
    }
}