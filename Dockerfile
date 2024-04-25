FROM nginx:stable
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/nginx.conf.template
ENV API_KEY VITE_SCANR_API_AUTHORIZATION
EXPOSE 5173
