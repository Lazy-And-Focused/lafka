# BASE
FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
WORKDIR /app

# DEPENDENCIES
FROM base AS dependencies

COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod

COPY . /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# BUILD
FROM base AS build

COPY --from=dependencies /app/node_modules /app/node_modules
COPY . .

RUN pnpm run build

# PRODUCTION
FROM node:20-alpine AS production

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY ./.env.development /app/

# START
USER node
CMD [ "node", "dist/main.js" ]