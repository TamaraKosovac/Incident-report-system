package org.unibl.etf.pisio.authservice.client;

import org.unibl.etf.pisio.authservice.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service", url = "${user-service.url}")
public interface UserClient {

    @GetMapping("/api/users/search")
    UserDTO getByUsername(@RequestParam("username") String username);
}
