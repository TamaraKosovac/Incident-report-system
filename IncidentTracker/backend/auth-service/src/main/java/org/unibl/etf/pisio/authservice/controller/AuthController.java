package org.unibl.etf.pisio.authservice.controller;

import org.unibl.etf.pisio.authservice.client.UserClient;
import org.unibl.etf.pisio.authservice.dto.JwtDTO;
import org.unibl.etf.pisio.authservice.dto.LoginDTO;
import org.unibl.etf.pisio.authservice.dto.RegisterDTO;
import org.unibl.etf.pisio.authservice.dto.UserDTO;
import org.unibl.etf.pisio.authservice.security.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserClient userClient;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserClient userClient, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userClient = userClient;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO request) {
        UserDTO user = userClient.getByUsername(request.getUsername());

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        String token = jwtUtils.generateJwtToken(user.getId(), user.getUsername(), List.of(user.getRole()));

        return ResponseEntity.ok(new JwtDTO(token, "Bearer", user.getUsername(), List.of(user.getRole())));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterDTO request) {
        UserDTO created = userClient.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}