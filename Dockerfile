FROM node:22-slim AS base

ARG COMMENT_SERVER=${COMMENT_SERVER}
ENV COMMENT_SERVER=${COMMENT_SERVER}
ARG UMAMI_URL=${UMAMI_URL}
ENV UMAMI_URL=${UMAMI_URL}
ARG UMAMI_ID=${UMAMI_ID}
ENV UMAMI_ID=${UMAMI_ID}

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app
RUN pnpm install --frozen-lockfile
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm run build

FROM caddy:2-alpine
COPY --from=base /app/dist /public/www
COPY ./Caddyfile /etc/caddy/Caddyfile
EXPOSE 8000
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
