#!/bin/sh

/usr/sbin/php-fpm

nohup /wait-for-it.sh db:3306 -- bin/console app:import-ontology > /dev/null 2> /dev/null &

/usr/sbin/httpd -D FOREGROUND