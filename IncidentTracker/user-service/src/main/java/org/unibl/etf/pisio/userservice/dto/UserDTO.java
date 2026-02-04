package org.unibl.etf.pisio.userservice.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String role;
    private String firstName;
    private String lastName;
    private String email;
}