FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
COPY . .  
RUN npm ci --silent

# Construire le projet si nécessaire
RUN npm run build

CMD ["npm", "start"]
EXPOSE 5173
