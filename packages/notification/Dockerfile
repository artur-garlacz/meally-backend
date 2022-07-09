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
COPY ./packages/notification ./packages/notification

# "lerna boostrap" will install all packages of base and backend
RUN npx lerna bootstrap
# # compile lib: ts -> js
# RUN npm run build:lib
# # compile app: ts -> js
# RUN npm run build:app
# RUN npm run migrations:run:app
# RUN npm run start:app

# EXPOSE 8082
# CMD [ "npm", "--prefix", "packages/app", "run", "prod" ]
