FROM nginx:1.15-alpine AS production

ADD nginx.conf /etc/nginx
RUN nginx -t

RUN mkdir -p /crust
ADD dist /crust/webapp

EXPOSE 80

RUN chown nginx.nginx /usr/share/nginx/html/ -R
