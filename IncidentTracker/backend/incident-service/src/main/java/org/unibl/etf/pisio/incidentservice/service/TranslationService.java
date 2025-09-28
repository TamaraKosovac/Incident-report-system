package org.unibl.etf.pisio.incidentservice.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class TranslationService {

    private static final String URL = "http://localhost:5001/translate";

    public String translate(String text, String source, String target) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("text", text);
        requestBody.put("source", source);
        requestBody.put("target", target);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        Map response = restTemplate.postForObject(URL, entity, Map.class);

        return response.get("translatedText").toString();
    }
}