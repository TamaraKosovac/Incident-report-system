package org.unibl.etf.pisio.userservice.controller;

import org.springframework.http.HttpStatus;
import org.unibl.etf.pisio.userservice.dto.RegisterDTO;
import org.unibl.etf.pisio.userservice.dto.UserDTO;
import org.unibl.etf.pisio.userservice.model.Role;
import org.unibl.etf.pisio.userservice.model.User;
import org.unibl.etf.pisio.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<User> getAll() {
        return service.getAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN || u.getRole() == Role.MODERATOR)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(user -> ResponseEntity.ok(service.toDTO(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateSimple(
            @PathVariable Long id,
            @RequestBody UserDTO dto) {

        UserDTO updated = service.updateSimple(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<User> getByUsername(@RequestParam String username) {
        return service.getByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody RegisterDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setRole(Role.USER);
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());

        User saved = service.create(user);

        UserDTO response = new UserDTO();
        response.setId(saved.getId());
        response.setUsername(saved.getUsername());
        response.setRole(saved.getRole().name());
        response.setFirstName(saved.getFirstName());
        response.setLastName(saved.getLastName());
        response.setEmail(saved.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/employee")
    public ResponseEntity<User> createEmployee(@RequestBody User user) {
        if (user.getRole() == null ||
                (user.getRole() != Role.ADMIN && user.getRole() != Role.MODERATOR)) {
            return ResponseEntity.badRequest().build();
        }
        User saved = service.create(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
