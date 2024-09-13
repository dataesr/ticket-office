<<<<<<< HEAD
FROM oven/bun

WORKDIR /app

COPY ./server/package.json .
RUN bun i --production
COPY ./server .

ENV NODE_ENV=production
CMD ["bun", "run", "index.ts"]

EXPOSE 3000
=======
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
COPY . .  
RUN npm ci --silent

# Construire le projet si nécessaire
RUN npm run build

CMD ["npm", "start"]
<<<<<<< HEAD
EXPOSE 3000
>>>>>>> f695a6a (fix(ci): change nginx conf by traditional dockerfile)
=======
EXPOSE 5173
>>>>>>> 5ea7c01 (typo)
