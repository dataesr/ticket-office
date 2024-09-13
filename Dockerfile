<<<<<<< HEAD
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
=======
FROM node:18-alpine AS build
>>>>>>> a4cac25 (fix(ci): deploiement)
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .

<<<<<<< HEAD
# Construire le projet si nécessaire
RUN npm run build

CMD ["npm", "start"]
<<<<<<< HEAD
EXPOSE 3000
>>>>>>> f695a6a (fix(ci): change nginx conf by traditional dockerfile)
=======
EXPOSE 5173
>>>>>>> 5ea7c01 (typo)
=======
# staging environment
FROM nginx:stable
COPY --from=build /app/build /usr/share/nginx/html
<<<<<<< HEAD
COPY ./nginx/templates /etc/nginx/templates
EXPOSE 3000
>>>>>>> a4cac25 (fix(ci): deploiement)
=======
COPY nginx.conf /etc/nginx/templates/nginx.conf.template
EXPOSE 5173
>>>>>>> 5dc5b75 (fix(ci): deploiement)
