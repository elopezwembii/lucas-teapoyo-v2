# Build Stage
FROM node:20.10.0 as builder
##ONLY USED FOR PHP API
ENV NODE_TLS_REJECT_UNAUTHORIZED='0'

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20.10.0 as runtime

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

COPY --from=builder /app/dist .

ENTRYPOINT [ "node", "/app/main.js" ]
