# Stage 1: Build với Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
# Tải dependencies trước
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Tạo image chạy
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /opt/app

# Sao chép jar file từ stage build
COPY --from=build /app/target/rsa-sha256-signature-1.0.0.jar app.jar

# Expose port 8081
EXPOSE 8081

# Cấu hình JVM để tối ưu cho container
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Chạy ứng dụng
CMD ["java", "-jar", "app.jar"]