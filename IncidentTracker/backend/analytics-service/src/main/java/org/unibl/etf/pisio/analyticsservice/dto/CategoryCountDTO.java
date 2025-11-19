package org.unibl.etf.pisio.analyticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryCountDTO {
    private String name;
    private Long count;
}