package ch.baselhack.underwriting.model;

import ch.baselhack.underwriting.model.enums.RiskCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "application")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "offering_id")
    private Offering offering;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private List<Submission> submissions;

    private Double riskScore;

    @Enumerated(EnumType.STRING)
    private RiskCategory riskCategory;

    @Column(columnDefinition = "TEXT")
    private String adminNotes;

    private String reviewedBy;

    private LocalDateTime reviewedAt;

    private Boolean isReviewed = false;

    @NotNull
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isReviewed == null) {
            isReviewed = false;
        }
    }
}
