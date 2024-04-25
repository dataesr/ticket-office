FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ARG VITE_SCANR_API_AUTHORIZATION

ENV VITE_SCANR_API_AUTHORIZATION=$VITE_SCANR_API_AUTHORIZATION

RUN npm run build

EXPOSE 5173

CMD [ "npm", "run", "preview" ]

