FROM --platform=$BUILDPLATFORM node:alpine AS build
ARG TARGETPLATFORM
ARG BUILDPLATFORM
RUN echo "I am running on $BUILDPLATFORM, building for $TARGETPLATFORM" > /log

FROM nginx:latest

COPY dist/ /usr/share/nginx/html/

RUN rm /etc/nginx/conf.d/default.conf

ADD default.conf /etc/nginx/conf.d/
