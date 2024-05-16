FROM nginx:stable
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/nginx.conf.template
EXPOSE 5173