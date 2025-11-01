package ch.baselhack.underwriting.resources.constants;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ApplicationConstants {
    public static final String API_V1 = "/api/v1";
    public static final String OFFERINGS_API = API_V1 + "/offerings";
    public static final String CLIENTS_API = API_V1 + "/clients";
    public static final String QUESTIONS_API = API_V1 + "/questions";
}
