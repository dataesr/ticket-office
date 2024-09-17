FROM oven/bun AS builder

WORKDIR /app

COPY ./client/package.json ./client/
RUN cd client && npm ci

COPY ./client ./client
RUN cd client && npm run build --emptyOutDir --outDir '../server/public'

COPY ./server/package.json ./server/
RUN bun i --production
COPY ./server ./server

ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "run", "server/index.ts"]
