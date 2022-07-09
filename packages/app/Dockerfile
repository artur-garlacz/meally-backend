FROM node:16

ENV APP_PATH /meally
WORKDIR $APP_PATH

# Copy package.json and lerna.json to /meally
COPY ./package.json ./
COPY ./lerna.json ./
COPY ./tsconfig.json ./

# install lerna local
RUN npm install

# Bundle app source
COPY ./packages/lib ./packages/lib
COPY ./packages/app ./packages/app

# "lerna boostrap" will install all packages of base and backend
RUN npx lerna bootstrap
