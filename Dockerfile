FROM oven/bun:1.3.1-alpine

WORKDIR /app

COPY ./server/package.json .
RUN bun i --production
COPY ./server .

ENV NODE_ENV=production
CMD ["bun", "run", "index.ts"]

EXPOSE 3000