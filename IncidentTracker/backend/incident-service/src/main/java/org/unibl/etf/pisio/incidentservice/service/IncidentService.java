package org.unibl.etf.pisio.incidentservice.service;

import org.unibl.etf.pisio.incidentservice.model.Incident;
import org.unibl.etf.pisio.incidentservice.repository.IncidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class IncidentService {

    private final IncidentRepository repository;

    public IncidentService(IncidentRepository repository) {
        this.repository = repository;
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

        return repository.save(incident);
    }

    public Optional<Incident> update(Long id, Incident updated) {
        return repository.findById(id).map(existing -> {
            existing.setType(updated.getType());
            existing.setSubtype(updated.getSubtype());
            existing.setStatus(updated.getStatus());
            existing.setDescription(updated.getDescription());
            existing.setLocation(updated.getLocation());
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
}
