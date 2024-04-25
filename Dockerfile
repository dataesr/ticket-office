FROM nginx:stable
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/nginx.conf.template
ENV VITE_SCANR_API_AUTHORIZATION $VITE_SCANR_API_AUTHORIZATION
EXPOSE 5173
