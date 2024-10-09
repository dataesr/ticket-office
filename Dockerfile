FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build:staging

# staging environment
FROM nginx:stable
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx/templates /etc/nginx/templates
EXPOSE 3000