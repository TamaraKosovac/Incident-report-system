package org.unibl.etf.pisio.incidentservice.service;

import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import org.unibl.etf.pisio.incidentservice.dto.IncidentDTO;
import org.unibl.etf.pisio.incidentservice.dto.IncidentNlpRequestDTO;
import org.unibl.etf.pisio.incidentservice.dto.IncidentNlpResponseDTO;
import org.unibl.etf.pisio.incidentservice.model.Incident;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentStatus;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentSubtype;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentType;
import org.unibl.etf.pisio.incidentservice.repository.IncidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.format.DateTimeFormatter;

@Service
public class IncidentService {

    private final IncidentRepository repository;
    private final TranslationService translationService;

    public IncidentService(IncidentRepository repository, TranslationService translationService) {
        this.repository = repository;
        this.translationService = translationService;
    }

    public List<Incident> getAll() {
        return repository.findAll();
    }

    public Optional<Incident> getById(Long id) {
        return repository.findById(id);
    }

    public Incident create(Incident incident, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            String uploadDir = "uploads/";
            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path path = Paths.get(uploadDir + fileName);

            Files.createDirectories(path.getParent());
            Files.copy(image.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            incident.setImagePath("/uploads/" + fileName);
        }

        if (incident.getDescription() != null && !incident.getDescription().isBlank()) {
            String translated = translationService.translate(incident.getDescription(), "sr", "en");
            incident.setDescriptionEn(translated);
        }

        incident.setStatus(IncidentStatus.REPORTED);
        List<Incident> existingIncidents = repository.findAll();
        IncidentStatus analyzedStatus = analyzeWithNlp(incident, existingIncidents);
        incident.setStatus(analyzedStatus);
        return repository.save(incident);
    }

    public Optional<Incident> update(Long id, Incident updated) {
        return repository.findById(id).map(existing -> {
            existing.setType(updated.getType());
            existing.setSubtype(updated.getSubtype());
            existing.setStatus(updated.getStatus());
            existing.setDescription(updated.getDescription());
            existing.setLocation(updated.getLocation());
            if (updated.getDescription() != null && !updated.getDescription().isBlank()) {
                String translated = translationService.translate(updated.getDescription(), "sr", "en");
                existing.setDescriptionEn(translated);
            }
            return repository.save(existing);
        });
    }

    public boolean delete(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Incident> getApprovedWithFilters(
            IncidentType type,
            IncidentSubtype subtype,
            String location,
            String period
    ) {
        List<Incident> approved = repository.findByStatus(IncidentStatus.APPROVED);

        LocalDateTime fromDate = switch (period) {
            case "24h" -> LocalDateTime.now().minusHours(24);
            case "7d"  -> LocalDateTime.now().minusDays(7);
            case "31d" -> LocalDateTime.now().minusDays(31);
            default    -> null;
        };

        return approved.stream()
                .filter(i -> type == null || i.getType() == type)
                .filter(i -> subtype == null || i.getSubtype() == subtype)
                .filter(i -> location == null ||
                        (i.getLocation() != null && i.getLocation().getAddress() != null &&
                                i.getLocation().getAddress().toLowerCase().contains(location.toLowerCase())))
                .filter(i -> fromDate == null ||
                        (i.getCreatedAt() != null && i.getCreatedAt().isAfter(fromDate)))
                .toList();
    }

    public List<Incident> getByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    private IncidentStatus analyzeWithNlp(Incident incident, List<Incident> existing) {
        RestTemplate restTemplate = new RestTemplate();
        String nlpUrl = "http://localhost:5000/analyze";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

        IncidentDTO newDto = new IncidentDTO(
                incident.getDescription(),
                incident.getLocation() != null ? incident.getLocation().getLatitude() : null,
                incident.getLocation() != null ? incident.getLocation().getLongitude() : null,
                incident.getCreatedAt() != null ? incident.getCreatedAt().format(formatter) : null
        );

        List<IncidentDTO> existingDtos = existing.stream()
                .map(i -> new IncidentDTO(
                        i.getDescription(),
                        i.getLocation() != null ? i.getLocation().getLatitude() : null,
                        i.getLocation() != null ? i.getLocation().getLongitude() : null,
                        i.getCreatedAt() != null ? i.getCreatedAt().format(formatter) : null
                ))
                .toList();

        IncidentNlpRequestDTO requestBody = new IncidentNlpRequestDTO(newDto, existingDtos);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<IncidentNlpRequestDTO> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<IncidentNlpResponseDTO> response =
                    restTemplate.exchange(nlpUrl, HttpMethod.POST, requestEntity, IncidentNlpResponseDTO.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().getStatus();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return IncidentStatus.PENDING;
    }
}