package org.unibl.etf.pisio.alertservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AlertSchedulerService {

    private final AlertDetectionService detectionService;

    @Scheduled(fixedRate = 60000)
    public void runDetection() {
        detectionService.detect();
    }
}