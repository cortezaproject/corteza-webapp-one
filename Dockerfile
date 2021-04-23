# run stage
FROM node:12.14-alpine as run-stage

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . ./

CMD ["yarn", "start"]


# build stage
FROM run-stage as build-stage

RUN yarn build


# deploy stage
FROM nginx:stable-alpine as deploy-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
