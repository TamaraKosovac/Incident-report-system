package org.unibl.etf.pisio.userservice.service;

import org.unibl.etf.pisio.userservice.model.User;
import org.unibl.etf.pisio.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> getAll() {
        return repository.findAll();
    }

    public Optional<User> getById(Long id) {
        return repository.findById(id);
    }

    public User create(User user) {
        return repository.save(user);
    }

    public Optional<User> update(Long id, User updated) {
        return repository.findById(id).map(existing -> {
            existing.setUsername(updated.getUsername());
            existing.setPassword(updated.getPassword());
            existing.setRole(updated.getRole());
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

    public Optional<User> findByUsername(String username) {
        return repository.findByUsername(username);
    }
}
