FROM node:hydrogen AS build

WORKDIR /app

ARG BACKEND_API_URL

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

FROM node:hydrogen-alpine AS production

WORKDIR /app

COPY --from=build /app/.output /app

CMD ["node", "server/index.mjs"]
