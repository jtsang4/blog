FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM caddy:2-alpine
COPY --from=build /app/dist /public/www
COPY ./Caddyfile /etc/caddy/Caddyfile
EXPOSE 8000
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]