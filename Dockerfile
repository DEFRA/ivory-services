FROM node:10.16.0-alpine

#Install git as required to install defra-logging-facade
RUN set -xe \
    && apk update && apk upgrade \
    && apk add bash git postgresql-client \
    && npm install -g npm \
    && git --version && bash --version && npm -v && node -v && psql --version \
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

ENTRYPOINT [ "node", "index.js" ]
