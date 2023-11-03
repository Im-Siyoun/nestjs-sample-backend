# 개발서버 단계
FROM node:18.15-alpine As development

RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV development

COPY --chown=node:node package*.json yarn.lock ./

COPY --chown=node:node . .

RUN yarn

# 빌드단계
FROM node:18.15-alpine As build

WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV production

COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN yarn build
RUN yarn --production && yarn cache clean

# 배포단계
FROM node:18-alpine as production

WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV production

COPY --chown=node:node --from=build /app/dist dist
COPY --chown=node:node --from=build /app/node_modules node_modules

CMD ["node", "dist/main.js"]