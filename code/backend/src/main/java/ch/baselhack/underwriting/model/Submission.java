package ch.baselhack.underwriting.model;

import ch.baselhack.underwriting.model.enums.SubmissionValueType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(name = "submission")
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id")
    Client client;

    @ManyToOne
    @JoinColumn(name = "question_id")
    Question question;

    @NotNull
    private String value;

    @Enumerated(EnumType.STRING)
    private SubmissionValueType type;
}
