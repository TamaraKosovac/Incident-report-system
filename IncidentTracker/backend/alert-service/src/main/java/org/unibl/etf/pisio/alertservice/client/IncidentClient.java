package org.unibl.etf.pisio.alertservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.unibl.etf.pisio.alertservice.dto.IncidentDTO;

import java.util.List;

@FeignClient(name = "incident-service")
public interface IncidentClient {

    @GetMapping("/api/incidents/recent")
    List<IncidentDTO> getRecentIncidents(@RequestParam int days);
}