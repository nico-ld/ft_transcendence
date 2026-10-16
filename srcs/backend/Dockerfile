FROM python:3.12
WORKDIR /app
COPY requirements.txt .
COPY app/ .
COPY .env .
EXPOSE 8080
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8080"]
