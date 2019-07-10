FROM keymetrics/pm2:10-alpine

#Install git as required to install defra-logging-facade
RUN set -xe \
    && apk update && apk upgrade \
    && apk add bash git \
    && npm install -g npm \
    && git --version && bash --version && npm -v && node -v \
    && rm -rf /var/cache/apk/*

WORKDIR /home/node/app

RUN mkdir -p ./node_modules && chown -R node:node ./

USER node

COPY package*.json ./

COPY ./index.js .

RUN npm install --production

COPY ./server ./server

COPY --chown=node:node . .

EXPOSE 3010

ENTRYPOINT [ "pm2-runtime", "index.js" ]
