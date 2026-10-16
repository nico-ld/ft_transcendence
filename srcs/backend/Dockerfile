FROM python:3.12
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app/ .
EXPOSE 8080
# nginx serves the API under /api and does TLS
# --root-path makes generated URLs include /api, --proxy-headers + --forwarded-allow-ips trust nginx's
# X-Forwarded-Proto/For so the app sees https and the real client IP
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", \
     "--root-path", "/api", "--proxy-headers", "--forwarded-allow-ips", "*"]
