FROM registry.opensource.zalan.do/stups/node:8.4.0-31
LABEL maintainer="maximilian.fellner@zalando.de"

RUN apt-get update && apt-get install -y --no-install-recommends \
  git \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /home/tessellate

COPY package.json package.json

RUN npm install --production

COPY bin dist static ./

ENV NODE_ENV production
ENV MORGAN_FORMAT common
ENV APP_PORT 3005
ENV DEBUG tessellate-viewer:*

HEALTHCHECK --interval=5s CMD curl localhost:${APP_PORT}/health

EXPOSE 3005

CMD ["bin/tessellate-viewer"]
