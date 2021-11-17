#!/bin/sh

/usr/sbin/php-fpm
nohup /wait-for-it.sh db:3306 -- bin/console app:import-ontology > /dev/null 2> /dev/null &
nohup sh -c 'until [ -d "/var/www/html/materials-browser/api/var" ]; do sleep 1; done && chown -R apache:apache /var/www/html/materials-browser/api/var' > /dev/null 2> /dev/null &
/usr/sbin/httpd -D FOREGROUND