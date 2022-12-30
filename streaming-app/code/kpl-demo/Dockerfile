FROM maven:3.8.6-jdk-11 AS build 
WORKDIR /usr/src/app
COPY . .
RUN mvn clean install

# copy app, deps, and native binaries into lighter image
FROM openjdk:11-jre-slim
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/target/aws-kpl-demo.jar /usr/src/app/
CMD java -jar aws-kpl-demo.jar ${STREAM_NAME} ${AWS_REGION} ${SECONDS_TO_RUN}