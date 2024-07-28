FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json pnpm*.yaml ./

RUN npm i -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build
RUN pnpm prune --prod

FROM node:22-alpine as runner

WORKDIR /app

COPY --from=builder /app/build/ /app/build/
COPY --from=builder /app/package.json /app

ENV NODE_ENV=production

CMD ["node", "build"]
