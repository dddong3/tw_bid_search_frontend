FROM node:hydrogen AS build

WORKDIR /app

ARG BACKEND_API_URL

COPY package.json .

RUN npm install

COPY . .

RUN echo "BACKEND_API_URL=$BACKEND_API_URL" > .env \
    && npm run build

FROM node:hydrogen-alpine AS production

WORKDIR /app

COPY --from=build /app/.output /app

CMD ["node", "server/index.mjs"]
