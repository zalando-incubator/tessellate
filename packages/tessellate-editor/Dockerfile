FROM node:8-alpine
LABEL maintainer="maximilian.fellner@zalando.de"

WORKDIR /home/tessellate

COPY package.json package.json

RUN npm install --production

COPY conf.yaml conf.yaml
COPY bin bin
COPY dist dist

ENV NODE_ENV production

HEALTHCHECK --interval=5s CMD curl localhost:${APP_PORT}/health

EXPOSE 3005

CMD ["bin/tessellate-editor"]
