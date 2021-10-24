# Build Stage
FROM node:16-alpine AS builder

COPY . .

ARG NODE_ENV=production

RUN yarn install --production=false
RUN yarn build \
&& rm -rf node_modules

# Runtime Stage
FROM node:16-alpine

ENV APP_HOME=/usr/app
WORKDIR $APP_HOME

COPY --from=builder . .

RUN yarn install --production=true

EXPOSE 9000
CMD ["yarn", "start"]