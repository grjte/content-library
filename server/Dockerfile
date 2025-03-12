# syntax=docker/dockerfile:1.4
FROM node:lts-slim AS builder

# LABEL org.opencontainers.image.source=https://github.com/automerge/automerge-repo-sync-server
LABEL org.opencontainers.image.description="A simple automerge sync server and API backend for the ContentArchive application."
LABEL org.opencontainers.image.licenses=MIT

# Build the project
WORKDIR /usr/src/app
COPY package.json ./package.json
RUN npm install
COPY . .
RUN npm run build

# Run the project in development mode
FROM node:lts-slim AS development
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/.env ./.env
RUN npm install --only=production
EXPOSE 3030

ENV NODE_ENV=development
ENV DEBUG=*

HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:3030/ || exit 1

CMD [ "node", "./dist/index.js" ]

FROM development as dev-envs
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
EOF

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF

# install Docker tools (cli, buildx, compose)
# COPY --from=gloursdocker/docker / /

CMD [ "node", "./dist/index.js" ]
