package org.unibl.etf.pisio.alertservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.pisio.alertservice.model.AlertConfig;
import org.unibl.etf.pisio.alertservice.repository.AlertConfigRepository;

@Service
@RequiredArgsConstructor
public class AlertConfigService {

    private final AlertConfigRepository repo;

    public AlertConfig getConfig() {
        return repo.findById(1)
                .orElseGet(() -> repo.save(new AlertConfig()));
    }

    public AlertConfig update(AlertConfig config) {
        config.setId(1);
        return repo.save(config);
    }
}