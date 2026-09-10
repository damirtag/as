FROM node:22-alpine AS build

WORKDIR /workspace
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json tsconfig.package.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/base/package.json packages/base/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/domain/cache-client/package.json packages/domain/cache-client/package.json
RUN pnpm install --frozen-lockfile

COPY apps/api apps/api
COPY packages packages
RUN pnpm --filter api... build
RUN pnpm deploy --filter api --prod /runtime

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /runtime/ ./
EXPOSE 4000
CMD ["node", "dist/main.js"]
