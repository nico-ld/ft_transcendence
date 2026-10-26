FROM python:3.12
WORKDIR /app
COPY workspace ./workspace
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/app/ .
EXPOSE 8080
# nginx does TLS: --proxy-headers + --forwarded-allow-ips trust nginx's
# X-Forwarded-Proto/For so the app sees https and the real client IP
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", \
     "--proxy-headers", "--forwarded-allow-ips", "*", "--root-path", "/api"]
