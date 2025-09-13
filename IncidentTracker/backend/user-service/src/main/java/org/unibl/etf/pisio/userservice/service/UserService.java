package org.unibl.etf.pisio.userservice.service;

import org.unibl.etf.pisio.userservice.model.User;
import org.unibl.etf.pisio.userservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAll() {
        return repository.findAll();
    }

    public Optional<User> getById(Long id) {
        return repository.findById(id);
    }

    public User create(User user) {
        validatePassword(user.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repository.save(user);
    }

    public Optional<User> update(Long id, User updated) {
        return repository.findById(id).map(existing -> {
            validatePassword(updated.getPassword());
            existing.setUsername(updated.getUsername());
            existing.setPassword(passwordEncoder.encode(updated.getPassword()));
            existing.setRole(updated.getRole());
            existing.setFirstName(updated.getFirstName());
            existing.setLastName(updated.getLastName());
            existing.setEmail(updated.getEmail());
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

    private void validatePassword(String password) {
        String regex = "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$";
        if (!password.matches(regex)) {
            throw new IllegalArgumentException(
                    "Password must be at least 8 characters long, contain one uppercase letter, one number and one special character."
            );
        }
    }

    public Optional<User> getByUsername(String username) {
        return repository.findByUsername(username);
    }
}
