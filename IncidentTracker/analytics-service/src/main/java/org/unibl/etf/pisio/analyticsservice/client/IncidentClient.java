package org.unibl.etf.pisio.analyticsservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.unibl.etf.pisio.analyticsservice.dto.IncidentDTO;

import java.util.List;

@FeignClient(name = "incident-service")
public interface IncidentClient {

    @GetMapping("/api/incidents")
    List<IncidentDTO> getAllIncidents();
}