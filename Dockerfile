FROM node:12.18.0-alpine

WORKDIR /vsc/app

COPY package*.json ./

RUN chmod -R 777 /vsc/app

RUN npm install

COPY src src
COPY config config
COPY test test
COPY .babelrc .env ./

COPY . .

EXPOSE 3030

VOLUME /vsc/app


CMD ["npm", "run", "start"]
