FROM oven/bun:1 AS base

WORKDIR /app

COPY package.json bun.lock ./

RUN bun i

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev", "--hostname", "0.0.0.0", "--port", "3000"]
