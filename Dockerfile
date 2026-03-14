FROM node:22 AS builder

# build stage
WORKDIR /build

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# production stage

FROM nginx:1.28.2-alpine-slim

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/dist /usr/share/nginx/html
