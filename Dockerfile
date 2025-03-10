# ----------- BUILD STAGE ---------
FROM oven/bun AS build

WORKDIR /app

COPY package.json package.json
COPY server/package.json server/package.json
COPY client/package.json client/package.json
COPY bun.lockb bun.lockb

RUN bun install --frozen-lockfile


COPY . .

ENV NODE_ENV=production
RUN bun run build

# ----------- RUN STAGE -----------
FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/build .

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000
