package org.unibl.etf.pisio.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class JwtDTO {
    private String token;
    private String type = "Bearer";
    private String username;
    private List<String> roles;
}
