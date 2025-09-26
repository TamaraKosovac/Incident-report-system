package org.unibl.etf.pisio.authservice.client;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.unibl.etf.pisio.authservice.dto.RegisterDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.unibl.etf.pisio.authservice.dto.UserDTO;

@FeignClient(name = "user-service", url = "${user-service.url}")
public interface UserClient {

    @PostMapping("/api/users")
    UserDTO createUser(@RequestBody RegisterDTO user);

    @GetMapping("/api/users/search")
    UserDTO getByUsername(@RequestParam("username") String username);
}