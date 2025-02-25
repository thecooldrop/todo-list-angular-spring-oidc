FROM eclipse-temurin:23-jdk-alpine-3.20@sha256:0632a94bd1eb806c0de4298b532566a5f40593b05c5287b6aa3744511a72e66c AS extracter
WORKDIR /src
COPY target/app.jar app.jar
RUN java -Djarmode=tools -jar app.jar extract --destination /src/extracted
RUN java -Djarmode=tools -jar app.jar extract --layers --destination /src/layers

FROM eclipse-temurin:23-jdk-alpine-3.20@sha256:0632a94bd1eb806c0de4298b532566a5f40593b05c5287b6aa3744511a72e66c AS modules
WORKDIR /app
COPY --from=extracter /src /app
RUN jdeps --recursive --print-module-deps --ignore-missing-deps --multi-release 23 --class-path '/app/extracted/lib/*' /app/extracted/app.jar > modules.info


FROM eclipse-temurin:23-jdk-alpine-3.20@sha256:0632a94bd1eb806c0de4298b532566a5f40593b05c5287b6aa3744511a72e66c AS jlink
WORKDIR /app
COPY --from=modules /app/modules.info /app/modules.info
RUN cat modules.info
RUN jlink --add-modules $(cat modules.info) --no-header-files --no-man-pages --strip-debug --compress 2 --output /jre

FROM eclipse-temurin:23-jdk-alpine-3.20@sha256:0632a94bd1eb806c0de4298b532566a5f40593b05c5287b6aa3744511a72e66c AS exec
WORKDIR /app
COPY --from=jlink /jre /jre
ENV PATH=/jre/bin:$PATH
COPY --from=extracter /src/layers/dependencies .
COPY --from=extracter /src/layers/spring-boot-loader .
COPY --from=extracter /src/layers/snapshot-dependencies .
COPY --from=extracter /src/layers/application .
ENTRYPOINT [ "java", "-jar", "/app/app.jar" ]
