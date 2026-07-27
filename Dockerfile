FROM oven/bun:alpine

WORKDIR /app

COPY ./server/package.json .
RUN bun i --production
COPY ./server .

ENV NODE_ENV=production
CMD ["bun", "run", "--preload", "./preload-bun-fix.ts", "index.ts"]

EXPOSE 3000