FROM oven/bun:1.3.1-alpine

WORKDIR /app

COPY ./server/package.json ./server/bun.lockb* ./

RUN bun install --frozen-lockfile --production

COPY ./server .

ENV NODE_ENV=production

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["bun", "run", "index.ts"]