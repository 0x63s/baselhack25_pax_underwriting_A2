# Build stage
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .

# Make mvnw executable
RUN chmod +x mvnw

# Normalize line endings (remove CRLF) so the script's shebang is valid inside the Linux image
# This prevents "/bin/sh: 1: ./mvnw: not found" when mvnw has Windows CRLF endings.
RUN sed -i 's/\r$//' mvnw || true
RUN if [ -d .mvn ]; then find .mvn -type f -exec sed -i 's/\r$//' {} \; || true; fi

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
