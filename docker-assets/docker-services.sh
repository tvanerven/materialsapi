#!/bin/sh

# This script contains all command to launch by Dockerfile.

# Start php-fpm.
#/usr/sbin/php-fpm

# Wait asynchronously that database is ready to insert data.
#nohup /wait-for-it.sh db:3306 -- bin/console app:import-ontology > /dev/null 2> /dev/null &

# Wait asynchronously that api/var directory has been created to change his rights.
#nohup sh -c 'until [ -d "/var/www/html/materials-browser/api/var" ]; do sleep 1; done && chown -R apache:apache /var/www/html/materials-browser/api/var' > /dev/null 2> /dev/null &

# Start Apache server
/usr/sbin/httpd -D FOREGROUND
