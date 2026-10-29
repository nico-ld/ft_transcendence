FROM nginx:1.28-alpine

# self signed cert for https://localhost generated at build time
RUN apk add --no-cache openssl \
 && mkdir -p /etc/nginx/certs \
 && openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
      -keyout /etc/nginx/certs/selfsigned.key \
      -out /etc/nginx/certs/selfsigned.crt \
      -subj "/CN=localhost" \
      -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

COPY nginx.conf /etc/nginx/nginx.conf

# the entrypoint substitutes every environment variable matching this regex in
# the templates. Restricted to NODE_UPSTREAM so that nothing else in the
# environment can eat an nginx $variable.
ENV NGINX_ENVSUBST_FILTER="^NODE_UPSTREAM$" \
    NODE_UPSTREAM="frontend:3000"

EXPOSE 6767
