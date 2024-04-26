# https://github.com/docker-library/docs/tree/master/nginx#using-environment-variables-in-nginx-configuration-new-in-119
FROM nginx:stable
COPY  dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/nginx.conf.template
EXPOSE 5173