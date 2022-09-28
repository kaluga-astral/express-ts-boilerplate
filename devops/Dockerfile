FROM node:16 AS build

WORKDIR /usr/src/app

# Копируется информация о зависимостях
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY .npmrc ./.npmrc

# Копируются исходники
COPY src ./src
COPY env ./env

# Игнорируются devDependency при установке зависимостей
RUN npm i --production

# Билд ts
RUN npm run build

CMD npm run start
