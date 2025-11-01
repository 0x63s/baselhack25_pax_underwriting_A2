package ch.baselhack.underwriting.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "question_weights")
public class QuestionWeights {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id")
    Question question;

    private String weights;
}
