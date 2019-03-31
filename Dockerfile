FROM node:alpine AS api-builder

RUN mkdir -p /build
COPY package.json ./build/
COPY yarn.lock ./build/
COPY src/ ./build/src

WORKDIR /build
RUN yarn install --ignore-engines
RUN yarn run build

FROM node:alpine
COPY --from=api-builder /build/package.json ./
COPY --from=api-builder /build/yarn.lock ./
COPY --from=api-builder /build/dist ./
COPY --from=api-builder /build/node_modules ./node_modules

ENTRYPOINT ["node", "index.js"]