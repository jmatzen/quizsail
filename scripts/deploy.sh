#!/bin/sh
BUILD=`gcloud builds list --limit 1 --filter STATUS=SUCCESS | tail -1 | awk '{print $5}'`
CURRENT_RUN=`docker ps | grep quizsail | awk '{print $1}'`
echo pulling $BUILD
docker pull $BUILD
echo stopping $CURRENT_RUN
docker stop $CURRENT_RUN
echo starting $BUILD
docker run --mount 'type=volume,src=quizsail,dst=/usr/src/app/data' --restart=always -i -p 49000:3000 -d $BUILD
