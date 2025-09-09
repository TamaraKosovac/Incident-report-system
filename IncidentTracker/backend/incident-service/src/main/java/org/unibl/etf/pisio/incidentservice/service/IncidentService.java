package org.unibl.etf.pisio.incidentservice.service;

import org.unibl.etf.pisio.incidentservice.model.Incident;
import org.unibl.etf.pisio.incidentservice.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public Incident create(Incident incident) {
        return repository.save(incident);
    }

    public Optional<Incident> update(Long id, Incident updated) {
        return repository.findById(id).map(existing -> {
            existing.setType(updated.getType());
            existing.setDescription(updated.getDescription());
            existing.setLocation(updated.getLocation());
            existing.setImagePath(updated.getImagePath());
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
