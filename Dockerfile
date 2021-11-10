FROM centos:8

ARG API_ADDRESS
ARG MYSQL_USER
ARG MYSQL_PASSWORD
ARG MYSQL_DATABASE

RUN dnf update -y \
&& dnf install -y vim bash unzip httpd php php-{fpm,cli,gd,pdo,xml,mbstring,zip,mysqlnd,opcache,json,intl,process} \
&& dnf module -y reset php \
&& dnf module -y enable php:7.4 \
&& dnf update -y

COPY ./dist/materials-browser-front/materials-browser.zip .
COPY ./docker-config/materials-browser_p80.conf /etc/httpd/conf.d
COPY ./docker-config/docker-services.sh /

RUN unzip materials-browser.zip -d /var/www/html/materials-browser \
&& chown -R apache /var/www/html/materials-browser \
&& mkdir /run/php-fpm \
&& chmod a+x /docker-services.sh \
&& sed -i "s|http://localhost:8000|${API_ADDRESS}|g" /var/www/html/materials-browser/assets/environment.json \
&& echo DATABASE_URL=mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@127.0.0.1:3306/${MYSQL_DATABASE}?serverVersion=5.5 > /var/www/html/materials-browser/api/.env.local

EXPOSE 80 443

WORKDIR /var/www/html/materials-browser/api

CMD ["/docker-services.sh"]