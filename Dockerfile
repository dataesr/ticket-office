FROM nginx:stable
ARG VITE_SCANR_API_AUTHORIZATION
ENV VITE_SCANR_API_AUTHORIZATION=$VITE_SCANR_API_AUTHORIZATION
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/nginx.conf.template
EXPOSE 5173
