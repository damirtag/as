FROM node:22-alpine AS build

WORKDIR /workspace
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json tsconfig.package.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
RUN pnpm install --frozen-lockfile

COPY apps/web apps/web
COPY packages/contracts packages/contracts
ARG VITE_AUTH_URL=http://localhost:4000/auth
ARG VITE_GQL_URL=http://localhost:4000/graphql
ENV VITE_AUTH_URL=$VITE_AUTH_URL
ENV VITE_GQL_URL=$VITE_GQL_URL
RUN pnpm --filter web build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN npm install --global serve
COPY --from=build /workspace/apps/web/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
