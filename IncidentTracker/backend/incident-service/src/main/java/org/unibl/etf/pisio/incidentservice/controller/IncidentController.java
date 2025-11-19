package org.unibl.etf.pisio.incidentservice.controller;

import org.unibl.etf.pisio.incidentservice.model.Incident;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentSubtype;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentType;
import org.unibl.etf.pisio.incidentservice.service.IncidentService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService service;

    public IncidentController(IncidentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Incident> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Incident> create(
            @ModelAttribute Incident incident,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) throws IOException {

        if (userId != null) {
            incident.setUserId(Long.valueOf(userId));
        }

        return ResponseEntity.ok(service.create(incident, image));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Incident> update(@PathVariable Long id, @RequestBody Incident updated) {
        return service.update(id, updated)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/approved")
    public List<Incident> getApprovedIncidentsFiltered(
            @RequestParam(required = false) IncidentType type,
            @RequestParam(required = false) IncidentSubtype subtype,
            @RequestParam(required = false) String location,
            @RequestParam(required = false, defaultValue = "all") String period
    ) {
        return service.getApprovedWithFilters(type, subtype, location, period);
    }

    @GetMapping("/my")
    public List<Incident> getMyIncidents(@RequestHeader("X-User-Id") Long userId) {
        return service.getByUserId(userId);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Incident> approve(@PathVariable Long id) {
        return service.approveIncident(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Incident> reject(@PathVariable Long id) {
        return service.rejectIncident(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @GetMapping("/recent")
    public List<Incident> getRecent(@RequestParam(defaultValue = "7") int days) {
        return service.getRecent(days);
    }
}