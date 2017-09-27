FROM registry.opensource.zalan.do/stups/node:8.4.0-31
LABEL maintainer="maximilian.fellner@zalando.de"

RUN apt-get update && apt-get install -y --no-install-recommends \
  git \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /home/tessellate

COPY package.json package.json

RUN npm install --production

COPY conf.yaml conf.yaml
COPY bin/ bin/
COPY dist/ dist/

ENV NODE_ENV production

HEALTHCHECK --interval=5s CMD curl localhost:${APP_PORT}/health

EXPOSE 3003

CMD ["bin/tessellate-fragment"]
