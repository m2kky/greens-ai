2026-Feb-23 19:56:10.009817 Starting deployment of m2kky/greens-ai:main to localhost.
2026-Feb-23 19:56:10.200285 Preparing container with helper image: ghcr.io/coollabsio/coolify-helper:1.0.12
2026-Feb-23 19:56:10.316412 [DEBUG] [CMD]: docker stop -t 30 q88kkscsgoggsockcs0g4o0k
2026-Feb-23 19:56:10.316412 [DEBUG] Error response from daemon: No such container: q88kkscsgoggsockcs0g4o0k
2026-Feb-23 19:56:10.477721 [DEBUG] [CMD]: docker run -d --network coolify --name q88kkscsgoggsockcs0g4o0k  --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/coollabsio/coolify-helper:1.0.12
2026-Feb-23 19:56:10.477721 [DEBUG] 8d43634af807d12b514966e0bef79403749b876f3c97824c665a2e0e1dbebe98
2026-Feb-23 19:56:12.327555 [DEBUG] [CMD]: docker exec q88kkscsgoggsockcs0g4o0k bash -c 'GIT_SSH_COMMAND="ssh -o ConnectTimeout=30 -p 22 -o Port=22 -o LogLevel=ERROR -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git ls-remote https://x-access-token:<REDACTED>@github.com/m2kky/greens-ai.git refs/heads/main'
2026-Feb-23 19:56:12.327555 [DEBUG] 28f953157128a0925f7b8d1d93554d2483cf4fd5	refs/heads/main
2026-Feb-23 19:56:12.575797 ----------------------------------------
2026-Feb-23 19:56:12.581409 Importing m2kky/greens-ai:main (commit sha 28f953157128a0925f7b8d1d93554d2483cf4fd5) to /artifacts/q88kkscsgoggsockcs0g4o0k.
2026-Feb-23 19:56:12.746370 [DEBUG] [CMD]: docker exec q88kkscsgoggsockcs0g4o0k bash -c 'git clone --depth=1 --recurse-submodules --shallow-submodules -b 'main' 'https://x-access-token:<REDACTED>@github.com/m2kky/greens-ai.git' '/artifacts/q88kkscsgoggsockcs0g4o0k' && cd '/artifacts/q88kkscsgoggsockcs0g4o0k' && if [ -f .gitmodules ]; then git submodule sync && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git submodule update --init --recursive --depth=1; fi && cd '/artifacts/q88kkscsgoggsockcs0g4o0k' && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git lfs pull'
2026-Feb-23 19:56:12.746370 [DEBUG] Cloning into '/artifacts/q88kkscsgoggsockcs0g4o0k'...
2026-Feb-23 19:56:13.762843 [DEBUG] [CMD]: docker exec q88kkscsgoggsockcs0g4o0k bash -c 'cd /artifacts/q88kkscsgoggsockcs0g4o0k && git log -1 28f953157128a0925f7b8d1d93554d2483cf4fd5 --pretty=%B'
2026-Feb-23 19:56:13.762843 [DEBUG] Environment
2026-Feb-23 19:56:13.902291 Image not found (ewg8ckg80048oo0go04kswog:28f953157128a0925f7b8d1d93554d2483cf4fd5). Building new image.
2026-Feb-23 19:56:14.606038 [DEBUG] [CMD]: docker exec q88kkscsgoggsockcs0g4o0k bash -c 'cat /artifacts/q88kkscsgoggsockcs0g4o0k/Dockerfile'
2026-Feb-23 19:56:14.606038 [DEBUG] FROM node:20-alpine AS deps
2026-Feb-23 19:56:14.606038 [DEBUG] WORKDIR /app
2026-Feb-23 19:56:14.606038 [DEBUG] COPY package.json package-lock.json* ./
2026-Feb-23 19:56:14.606038 [DEBUG] RUN npm ci --legacy-peer-deps
2026-Feb-23 19:56:14.606038 [DEBUG] 
2026-Feb-23 19:56:14.606038 [DEBUG] FROM node:20-alpine AS builder
2026-Feb-23 19:56:14.606038 [DEBUG] WORKDIR /app
2026-Feb-23 19:56:14.606038 [DEBUG] COPY --from=deps /app/node_modules ./node_modules
2026-Feb-23 19:56:14.606038 [DEBUG] COPY . .
2026-Feb-23 19:56:14.606038 [DEBUG] ENV NEXT_TELEMETRY_DISABLED=1
2026-Feb-23 19:56:14.606038 [DEBUG] RUN npm run build
2026-Feb-23 19:56:14.606038 [DEBUG] 
2026-Feb-23 19:56:14.606038 [DEBUG] FROM node:20-alpine AS runner
2026-Feb-23 19:56:14.606038 [DEBUG] WORKDIR /app
2026-Feb-23 19:56:14.606038 [DEBUG] ENV NODE_ENV=production
2026-Feb-23 19:56:14.606038 [DEBUG] ENV NEXT_TELEMETRY_DISABLED=1
2026-Feb-23 19:56:14.606038 [DEBUG] RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
2026-Feb-23 19:56:14.606038 [DEBUG] RUN mkdir -p ./public
2026-Feb-23 19:56:14.606038 [DEBUG] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
2026-Feb-23 19:56:14.606038 [DEBUG] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
2026-Feb-23 19:56:14.606038 [DEBUG] USER nextjs
2026-Feb-23 19:56:14.606038 [DEBUG] EXPOSE 3000
2026-Feb-23 19:56:14.606038 [DEBUG] ENV PORT=3000
2026-Feb-23 19:56:14.606038 [DEBUG] ENV HOSTNAME=0.0.0.0
2026-Feb-23 19:56:14.606038 [DEBUG] HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
2026-Feb-23 19:56:14.606038 [DEBUG] CMD wget -qO- http://localhost:3000/api/health || exit 1
2026-Feb-23 19:56:14.606038 [DEBUG] CMD ["node", "server.js"]
2026-Feb-23 19:56:14.815323 [DEBUG] Creating build-time .env file in /artifacts (outside Docker context).
2026-Feb-23 19:56:14.992328 ----------------------------------------
2026-Feb-23 19:56:14.998422 ⚠️ Build-time environment variable warning: NODE_ENV=production
2026-Feb-23 19:56:15.004089 Affects: Node.js/npm/yarn/bun/pnpm
2026-Feb-23 19:56:15.010624 Issue: Skips devDependencies installation which are often required for building (webpack, typescript, etc.)
2026-Feb-23 19:56:15.015981 Recommendation: Uncheck "Available at Buildtime" or use "development" during build
2026-Feb-23 19:56:15.020611 
2026-Feb-23 19:56:15.026135 💡 Tips to resolve build issues:
2026-Feb-23 19:56:15.030807 1. Set these variables as "Runtime only" in the environment variables settings
2026-Feb-23 19:56:15.035404 2. Use different values for build-time (e.g., NODE_ENV=development for build)
2026-Feb-23 19:56:15.039776 3. Consider using multi-stage Docker builds to separate build and runtime environments
2026-Feb-23 19:56:15.203658 [DEBUG] [CMD]: docker exec q88kkscsgoggsockcs0g4o0k bash -c 'cat /artifacts/q88kkscsgoggsockcs0g4o0k/Dockerfile'
2026-Feb-23 19:56:15.203658 [DEBUG] FROM node:20-alpine AS deps
2026-Feb-23 19:56:15.203658 [DEBUG] WORKDIR /app
2026-Feb-23 19:56:15.203658 [DEBUG] COPY package.json package-lock.json* ./
2026-Feb-23 19:56:15.203658 [DEBUG] RUN npm ci --legacy-peer-deps
2026-Feb-23 19:56:15.203658 [DEBUG] 
2026-Feb-23 19:56:15.203658 [DEBUG] FROM node:20-alpine AS builder
2026-Feb-23 19:56:15.203658 [DEBUG] WORKDIR /app
2026-Feb-23 19:56:15.203658 [DEBUG] COPY --from=deps /app/node_modules ./node_modules
2026-Feb-23 19:56:15.203658 [DEBUG] COPY . .
2026-Feb-23 19:56:15.203658 [DEBUG] ENV NEXT_TELEMETRY_DISABLED=1
2026-Feb-23 19:56:15.203658 [DEBUG] RUN npm run build
2026-Feb-23 19:56:15.203658 [DEBUG] 
2026-Feb-23 19:56:15.203658 [DEBUG] FROM node:20-alpine AS runner
2026-Feb-23 19:56:15.203658 [DEBUG] WORKDIR /app
2026-Feb-23 19:56:15.203658 [DEBUG] ENV NODE_ENV=production
2026-Feb-23 19:56:15.203658 [DEBUG] ENV NEXT_TELEMETRY_DISABLED=1
2026-Feb-23 19:56:15.203658 [DEBUG] RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
2026-Feb-23 19:56:15.203658 [DEBUG] RUN mkdir -p ./public
2026-Feb-23 19:56:15.203658 [DEBUG] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
2026-Feb-23 19:56:15.203658 [DEBUG] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
2026-Feb-23 19:56:15.203658 [DEBUG] USER nextjs
2026-Feb-23 19:56:15.203658 [DEBUG] EXPOSE 3000
2026-Feb-23 19:56:15.203658 [DEBUG] ENV PORT=3000
2026-Feb-23 19:56:15.203658 [DEBUG] ENV HOSTNAME=0.0.0.0
2026-Feb-23 19:56:15.203658 [DEBUG] HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
2026-Feb-23 19:56:15.203658 [DEBUG] CMD wget -qO- http://localhost:3000/api/health || exit 1
2026-Feb-23 19:56:15.203658 [DEBUG] CMD ["node", "server.js"]
2026-Feb-23 19:56:15.244396 [DEBUG] Final Dockerfile:
2026-Feb-23 19:56:15.620833 [DEBUG] [CMD]: docker exec q88kkscsgoggsockcs0g4o0k bash -c 'cat /artifacts/q88kkscsgoggsockcs0g4o0k/Dockerfile'
2026-Feb-23 19:56:15.620833 [DEBUG] FROM node:20-alpine AS deps
2026-Feb-23 19:56:15.620833 [DEBUG] ARG NODE_ENV=production
2026-Feb-23 19:56:15.620833 [DEBUG] ARG N8N_WEBHOOK_URL=https://n8n.muhammedmekky.com/webhook/greens-chat
2026-Feb-23 19:56:15.620833 [DEBUG] ARG NEXT_PUBLIC_APP_NAME=Greens AI
2026-Feb-23 19:56:15.620833 [DEBUG] ARG COOLIFY_URL=http://greenschat.muhammedmekky.com
2026-Feb-23 19:56:15.620833 [DEBUG] ARG COOLIFY_FQDN=greenschat.muhammedmekky.com
2026-Feb-23 19:56:15.620833 [DEBUG] ARG COOLIFY_BRANCH=main
2026-Feb-23 19:56:15.620833 [DEBUG] ARG COOLIFY_RESOURCE_UUID=ewg8ckg80048oo0go04kswog
2026-Feb-23 19:56:15.620833 [DEBUG] WORKDIR /app
2026-Feb-23 19:56:15.620833 [DEBUG] COPY package.json package-lock.json* ./
2026-Feb-23 19:56:15.620833 [DEBUG] RUN npm ci --legacy-peer-deps
2026-Feb-23 19:56:15.620833 [DEBUG] 
2026-Feb-23 19:56:15.620833 [DEBUG] FROM node:20-alpine AS builder
2026-Feb-23 19:56:15.620833 [DEBUG] ARG NODE_ENV=production
2026-Feb-23 19:56:15.620833 [DEBUG] ARG N8N_WEBHOOK_URL=https://n8n.muhammedmekky.com/webhook/greens-chat
2026-Feb-23 19:56:15.620833 [DEBUG] ARG NEXT_PUBLIC_APP_NAME=Greens AI
2026-Feb-23 19:56:15.620833 [DEBUG] ARG COOLIFY_URL=http://greenschat.muhammedmekky.com
2026-Feb-23 19:56:15.620833 [DEBUG] ARG COOLIFY_FQDN=greenschat.muhammedmekky.com
2026-Feb-23 19:56:15.620833 [DEBUG] ARG COOLIFY_BRANCH=main
2026-Feb-23 19:56:15.620833 [DEBUG] ARG COOLIFY_RESOURCE_UUID=ewg8ckg80048oo0go04kswog
2026-Feb-23 19:56:15.620833 [DEBUG] WORKDIR /app
2026-Feb-23 19:56:15.620833 [DEBUG] COPY --from=deps /app/node_modules ./node_modules
2026-Feb-23 19:56:15.620833 [DEBUG] COPY . .
2026-Feb-23 19:56:15.620833 [DEBUG] ENV NEXT_TELEMETRY_DISABLED=1
2026-Feb-23 19:56:15.620833 [DEBUG] RUN npm run build
2026-Feb-23 19:56:15.620833 [DEBUG] 
2026-Feb-23 19:56:15.620833 [DEBUG] FROM node:20-alpine AS runner
2026-Feb-23 19:56:15.620833 [DEBUG] ARG NODE_ENV=production
2026-Feb-23 19:56:15.620833 [DEBUG] ARG N8N_WEBHOOK_URL=https://n8n.muhammedmekky.com/webhook/greens-chat
2026-Feb-23 19:56:15.620833 [DEBUG] ARG NEXT_PUBLIC_APP_NAME=Greens AI
2026-Feb-23 19:56:15.620833 [DEBUG] ARG COOLIFY_URL=http://greenschat.muhammedmekky.com
2026-Feb-23 19:56:15.620833 [DEBUG] ARG COOLIFY_FQDN=greenschat.muhammedmekky.com
2026-Feb-23 19:56:15.620833 [DEBUG] ARG COOLIFY_BRANCH=main
2026-Feb-23 19:56:15.620833 [DEBUG] ARG COOLIFY_RESOURCE_UUID=ewg8ckg80048oo0go04kswog
2026-Feb-23 19:56:15.620833 [DEBUG] WORKDIR /app
2026-Feb-23 19:56:15.620833 [DEBUG] ENV NODE_ENV=production
2026-Feb-23 19:56:15.620833 [DEBUG] ENV NEXT_TELEMETRY_DISABLED=1
2026-Feb-23 19:56:15.620833 [DEBUG] RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
2026-Feb-23 19:56:15.620833 [DEBUG] RUN mkdir -p ./public
2026-Feb-23 19:56:15.620833 [DEBUG] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
2026-Feb-23 19:56:15.620833 [DEBUG] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
2026-Feb-23 19:56:15.620833 [DEBUG] USER nextjs
2026-Feb-23 19:56:15.620833 [DEBUG] EXPOSE 3000
2026-Feb-23 19:56:15.620833 [DEBUG] ENV PORT=3000
2026-Feb-23 19:56:15.620833 [DEBUG] ENV HOSTNAME=0.0.0.0
2026-Feb-23 19:56:15.620833 [DEBUG] HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
2026-Feb-23 19:56:15.620833 [DEBUG] CMD wget -qO- http://localhost:3000/api/health || exit 1
2026-Feb-23 19:56:15.620833 [DEBUG] CMD ["node", "server.js"]
2026-Feb-23 19:56:15.629007 ----------------------------------------
2026-Feb-23 19:56:15.633916 Building docker image started.
2026-Feb-23 19:56:15.638707 To check the current progress, click on Show Debug Logs.
2026-Feb-23 19:56:15.960930 [DEBUG] [CMD]: docker exec q88kkscsgoggsockcs0g4o0k bash -c 'cat /artifacts/build.sh'
2026-Feb-23 19:56:15.960930 [DEBUG] cd /artifacts/q88kkscsgoggsockcs0g4o0k && set -a && source /artifacts/build-time.env && set +a && docker build  --add-host coolify:10.0.1.5 --add-host coolify-db:10.0.1.8 --add-host coolify-realtime:10.0.1.4 --add-host coolify-redis:10.0.1.7 --add-host fsg8k800o0cwgs80scg00gcs:10.0.1.11 --add-host fsg8k800o0cwgs80scg00gcs-proxy:10.0.1.9 --add-host ic4c04s008gwc8cg4k8skkks:10.0.1.2 --add-host kgsw8cwgcswsc4ccsosk0kgg:10.0.1.6 --add-host v004w4ksw4c8ww488ogoo488:10.0.1.10 --add-host v004w4ksw4c8ww488ogoo488-proxy:10.0.1.13 --network host -f /artifacts/q88kkscsgoggsockcs0g4o0k/Dockerfile --build-arg COOLIFY_URL --build-arg COOLIFY_FQDN --build-arg COOLIFY_BRANCH --build-arg COOLIFY_RESOURCE_UUID --build-arg NODE_ENV --build-arg N8N_WEBHOOK_URL --build-arg NEXT_PUBLIC_APP_NAME --build-arg COOLIFY_BUILD_SECRETS_HASH=c28a5c22a766dc1dc95d486f776b5169dc66b964ee5914481387e16f6035604a --build-arg 'COOLIFY_URL' --build-arg 'COOLIFY_FQDN' --build-arg 'COOLIFY_BRANCH' --build-arg 'COOLIFY_RESOURCE_UUID' --progress plain -t ewg8ckg80048oo0go04kswog:28f953157128a0925f7b8d1d93554d2483cf4fd5 /artifacts/q88kkscsgoggsockcs0g4o0k
2026-Feb-23 19:56:16.915297 [DEBUG] [CMD]: docker exec q88kkscsgoggsockcs0g4o0k bash -c 'bash /artifacts/build.sh'
2026-Feb-23 19:56:16.915297 [DEBUG] #0 building with "default" instance using docker driver
2026-Feb-23 19:56:16.915297 [DEBUG] 
2026-Feb-23 19:56:16.915297 [DEBUG] #1 [internal] load build definition from Dockerfile
2026-Feb-23 19:56:16.915297 [DEBUG] #1 transferring dockerfile: 1.75kB done
2026-Feb-23 19:56:16.915297 [DEBUG] #1 DONE 0.0s
2026-Feb-23 19:56:16.915297 [DEBUG] 
2026-Feb-23 19:56:16.915297 [DEBUG] #2 [internal] load metadata for docker.io/library/node:20-alpine
2026-Feb-23 19:56:17.983694 [DEBUG] #2 DONE 1.2s
2026-Feb-23 19:56:18.153835 [DEBUG] #3 [internal] load .dockerignore
2026-Feb-23 19:56:18.153835 [DEBUG] #3 transferring context: 94B done
2026-Feb-23 19:56:18.153835 [DEBUG] #3 DONE 0.0s
2026-Feb-23 19:56:18.153835 [DEBUG] 
2026-Feb-23 19:56:18.153835 [DEBUG] #4 [internal] load build context
2026-Feb-23 19:56:18.153835 [DEBUG] #4 transferring context: 143.31kB 0.0s done
2026-Feb-23 19:56:18.153835 [DEBUG] #4 DONE 0.0s
2026-Feb-23 19:56:18.153835 [DEBUG] 
2026-Feb-23 19:56:18.153835 [DEBUG] #5 [deps 1/4] FROM docker.io/library/node:20-alpine@sha256:09e2b3d9726018aecf269bd35325f46bf75046a643a66d28360ec71132750ec8
2026-Feb-23 19:56:18.153835 [DEBUG] #5 resolve docker.io/library/node:20-alpine@sha256:09e2b3d9726018aecf269bd35325f46bf75046a643a66d28360ec71132750ec8 done
2026-Feb-23 19:56:18.153835 [DEBUG] #5 sha256:eb87f4721c91769ed5206f34a9ab6ec98fc1d5235c12c2fc956665b1155e9ecb 0B / 1.26MB 0.1s
2026-Feb-23 19:56:18.153835 [DEBUG] #5 sha256:e31b2016552274339ed88ed4a438d78bf37e0f6bdf328d02207b2a598c1ef86d 0B / 445B 0.1s
2026-Feb-23 19:56:18.153835 [DEBUG] #5 sha256:09e2b3d9726018aecf269bd35325f46bf75046a643a66d28360ec71132750ec8 7.67kB / 7.67kB done
2026-Feb-23 19:56:18.153835 [DEBUG] #5 sha256:c3324aa3efea082c8d294a93b97ba82adc5498a202bd48802f5a8af152e7dd9e 1.72kB / 1.72kB done
2026-Feb-23 19:56:18.153835 [DEBUG] #5 sha256:458b0b7c1c6027b37124839bf527a5c54936ab27a9c9643051a3d801c4560a6c 6.52kB / 6.52kB done
2026-Feb-23 19:56:18.153835 [DEBUG] #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 0B / 42.78MB 0.1s
2026-Feb-23 19:56:18.554674 [DEBUG] #5 sha256:e31b2016552274339ed88ed4a438d78bf37e0f6bdf328d02207b2a598c1ef86d 445B / 445B 0.4s done
2026-Feb-23 19:56:18.554674 [DEBUG] #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 8.39MB / 42.78MB 0.5s
2026-Feb-23 19:56:18.753308 [DEBUG] #5 sha256:eb87f4721c91769ed5206f34a9ab6ec98fc1d5235c12c2fc956665b1155e9ecb 1.26MB / 1.26MB 0.6s done
2026-Feb-23 19:56:18.753308 [DEBUG] #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 16.78MB / 42.78MB 0.7s
2026-Feb-23 19:56:18.853523 [DEBUG] #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 23.07MB / 42.78MB 0.8s
2026-Feb-23 19:56:19.053399 [DEBUG] #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 33.55MB / 42.78MB 1.0s
2026-Feb-23 19:56:19.266829 [DEBUG] #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 41.94MB / 42.78MB 1.2s
2026-Feb-23 19:56:19.432818 [DEBUG] #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 42.78MB / 42.78MB 1.3s done
2026-Feb-23 19:56:19.432818 [DEBUG] #5 extracting sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80
2026-Feb-23 19:56:20.977381 [DEBUG] #5 extracting sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 1.5s done
2026-Feb-23 19:56:21.182611 [DEBUG] #5 extracting sha256:eb87f4721c91769ed5206f34a9ab6ec98fc1d5235c12c2fc956665b1155e9ecb
2026-Feb-23 19:56:21.392839 [DEBUG] #5 extracting sha256:eb87f4721c91769ed5206f34a9ab6ec98fc1d5235c12c2fc956665b1155e9ecb 0.1s done
2026-Feb-23 19:56:21.392839 [DEBUG] #5 extracting sha256:e31b2016552274339ed88ed4a438d78bf37e0f6bdf328d02207b2a598c1ef86d done
2026-Feb-23 19:56:21.392839 [DEBUG] #5 DONE 3.4s
2026-Feb-23 19:56:21.551836 [DEBUG] #6 [deps 2/4] WORKDIR /app
2026-Feb-23 19:56:21.551836 [DEBUG] #6 DONE 0.1s
2026-Feb-23 19:56:21.551836 [DEBUG] 
2026-Feb-23 19:56:21.551836 [DEBUG] #7 [deps 3/4] COPY package.json package-lock.json* ./
2026-Feb-23 19:56:21.551836 [DEBUG] #7 DONE 0.1s
2026-Feb-23 19:56:21.551836 [DEBUG] 
2026-Feb-23 19:56:21.551836 [DEBUG] #8 [runner 3/6] RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
2026-Feb-23 19:56:21.741144 [DEBUG] #8 DONE 0.3s
2026-Feb-23 19:56:21.741144 [DEBUG] 
2026-Feb-23 19:56:21.741144 [DEBUG] #9 [deps 4/4] RUN npm ci --legacy-peer-deps
2026-Feb-23 19:56:21.916602 [DEBUG] #9 ...
2026-Feb-23 19:56:21.916602 [DEBUG] 
2026-Feb-23 19:56:21.916602 [DEBUG] #10 [runner 4/6] RUN mkdir -p ./public
2026-Feb-23 19:56:21.916602 [DEBUG] #10 DONE 0.2s
2026-Feb-23 19:56:22.067181 [DEBUG] #9 [deps 4/4] RUN npm ci --legacy-peer-deps
2026-Feb-23 19:56:38.301292 [DEBUG] #9 16.73 npm warn deprecated next@14.2.5: This version has a security vulnerability. Please upgrade to a patched version. See https://nextjs.org/blog/security-update-2025-12-11 for more details.
2026-Feb-23 19:56:38.508797 [DEBUG] #9 16.82
2026-Feb-23 19:56:38.508797 [DEBUG] #9 16.82 added 132 packages, and audited 133 packages in 16s
2026-Feb-23 19:56:38.508797 [DEBUG] #9 16.82
2026-Feb-23 19:56:38.508797 [DEBUG] #9 16.82 89 packages are looking for funding
2026-Feb-23 19:56:38.508797 [DEBUG] #9 16.82   run `npm fund` for details
2026-Feb-23 19:56:38.508797 [DEBUG] #9 16.95
2026-Feb-23 19:56:38.508797 [DEBUG] #9 16.95 1 critical severity vulnerability
2026-Feb-23 19:56:38.508797 [DEBUG] #9 16.95
2026-Feb-23 19:56:38.508797 [DEBUG] #9 16.95 To address all issues, run:
2026-Feb-23 19:56:38.508797 [DEBUG] #9 16.95   npm audit fix --force
2026-Feb-23 19:56:38.508797 [DEBUG] #9 16.95
2026-Feb-23 19:56:38.508797 [DEBUG] #9 16.95 Run `npm audit` for details.
2026-Feb-23 19:56:38.665366 [DEBUG] #9 16.96 npm notice
2026-Feb-23 19:56:38.665366 [DEBUG] #9 16.96 npm notice New major version of npm available! 10.8.2 -> 11.10.1
2026-Feb-23 19:56:38.665366 [DEBUG] #9 16.96 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.10.1
2026-Feb-23 19:56:38.665366 [DEBUG] #9 16.96 npm notice To update run: npm install -g npm@11.10.1
2026-Feb-23 19:56:38.665366 [DEBUG] #9 16.96 npm notice
2026-Feb-23 19:56:38.715402 [DEBUG] #9 DONE 17.2s
2026-Feb-23 19:56:45.552675 [DEBUG] #11 [builder 3/5] COPY --from=deps /app/node_modules ./node_modules
2026-Feb-23 19:56:52.387292 [DEBUG] #11 DONE 6.8s
2026-Feb-23 19:56:52.580365 [DEBUG] #12 [builder 4/5] COPY . .
2026-Feb-23 19:56:52.580365 [DEBUG] #12 DONE 0.0s
2026-Feb-23 19:56:52.580365 [DEBUG] 
2026-Feb-23 19:56:52.580365 [DEBUG] #13 [builder 5/5] RUN npm run build
2026-Feb-23 19:56:53.427534 [DEBUG] #13 0.995
2026-Feb-23 19:56:53.427534 [DEBUG] #13 0.995 > greens-ai@1.0.0 build
2026-Feb-23 19:56:53.427534 [DEBUG] #13 0.995 > next build
2026-Feb-23 19:56:53.427534 [DEBUG] #13 0.995
2026-Feb-23 19:56:54.491519 [DEBUG] #13 2.061   ▲ Next.js 14.2.5
2026-Feb-23 19:56:54.659979 [DEBUG] #13 2.061
2026-Feb-23 19:56:54.659979 [DEBUG] #13 2.079    Creating an optimized production build ...
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 Failed to compile.
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 ./src/app/globals.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[3]!./src/app/globals.css
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 Error: Cannot find module 'tailwindcss'
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 Require stack:
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack/config/blocks/css/index.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack/config/index.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack-config.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack/plugins/next-trace-entrypoints-plugin.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/collect-build-traces.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/index.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/cli/next-build.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at /app/node_modules/next/dist/server/require-hook.js:55:36
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Function.resolve (node:internal/modules/helpers:193:19)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at loadPlugin (/app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:49:32)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at /app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:157:56
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Array.map (<anonymous>)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at getPostCssPlugins (/app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:157:47)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at async /app/node_modules/next/dist/build/webpack/config/blocks/css/index.js:124:36
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at async /app/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js:51:40
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at async Span.traceAsyncFn (/app/node_modules/next/dist/trace/trace.js:154:20)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 Import trace for requested module:
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 ./src/app/globals.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[3]!./src/app/globals.css
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 ./src/app/globals.css
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 ./src/app/globals.css
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 Error: Cannot find module 'tailwindcss'
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 Require stack:
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack/config/blocks/css/index.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack/config/index.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack-config.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack/plugins/next-trace-entrypoints-plugin.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/collect-build-traces.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/index.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/cli/next-build.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at /app/node_modules/next/dist/server/require-hook.js:55:36
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Function.resolve (node:internal/modules/helpers:193:19)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at loadPlugin (/app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:49:32)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at /app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:157:56
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Array.map (<anonymous>)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at getPostCssPlugins (/app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:157:47)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at async /app/node_modules/next/dist/build/webpack/config/blocks/css/index.js:124:36
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at async /app/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js:51:40
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at async Span.traceAsyncFn (/app/node_modules/next/dist/trace/trace.js:154:20)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at tryRunOrWebpackError (/app/node_modules/next/dist/compiled/webpack/bundle5.js:28:312989)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at __webpack_require_module__ (/app/node_modules/next/dist/compiled/webpack/bundle5.js:28:131165)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at __nested_webpack_require_153728__ (/app/node_modules/next/dist/compiled/webpack/bundle5.js:28:130607)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at /app/node_modules/next/dist/compiled/webpack/bundle5.js:28:131454
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at symbolIterator (/app/node_modules/next/dist/compiled/neo-async/async.js:1:14444)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at done (/app/node_modules/next/dist/compiled/neo-async/async.js:1:14824)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Hook.eval [as callAsync] (eval at create (/app/node_modules/next/dist/compiled/webpack/bundle5.js:13:28858), <anonymous>:15:1)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (/app/node_modules/next/dist/compiled/webpack/bundle5.js:13:26012)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at /app/node_modules/next/dist/compiled/webpack/bundle5.js:28:130328
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at symbolIterator (/app/node_modules/next/dist/compiled/neo-async/async.js:1:14402)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 -- inner error --
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 Error: Cannot find module 'tailwindcss'
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 Require stack:
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack/config/blocks/css/index.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack/config/index.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack-config.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/webpack/plugins/next-trace-entrypoints-plugin.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/collect-build-traces.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/build/index.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 - /app/node_modules/next/dist/cli/next-build.js
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at /app/node_modules/next/dist/server/require-hook.js:55:36
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Function.resolve (node:internal/modules/helpers:193:19)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at loadPlugin (/app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:49:32)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at /app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:157:56
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Array.map (<anonymous>)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at getPostCssPlugins (/app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:157:47)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at async /app/node_modules/next/dist/build/webpack/config/blocks/css/index.js:124:36
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at async /app/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js:51:40
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at async Span.traceAsyncFn (/app/node_modules/next/dist/trace/trace.js:154:20)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Object.<anonymous> (/app/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[2]!/app/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[3]!/app/src/app/globals.css:1:7)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at /app/node_modules/next/dist/compiled/webpack/bundle5.js:28:922493
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Hook.eval [as call] (eval at create (/app/node_modules/next/dist/compiled/webpack/bundle5.js:13:28636), <anonymous>:7:1)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at Hook.CALL_DELEGATE [as _call] (/app/node_modules/next/dist/compiled/webpack/bundle5.js:13:25906)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at /app/node_modules/next/dist/compiled/webpack/bundle5.js:28:131198
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at tryRunOrWebpackError (/app/node_modules/next/dist/compiled/webpack/bundle5.js:28:312943)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at __webpack_require_module__ (/app/node_modules/next/dist/compiled/webpack/bundle5.js:28:131165)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at __nested_webpack_require_153728__ (/app/node_modules/next/dist/compiled/webpack/bundle5.js:28:130607)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at /app/node_modules/next/dist/compiled/webpack/bundle5.js:28:131454
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81     at symbolIterator (/app/node_modules/next/dist/compiled/neo-async/async.js:1:14444)
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 Generated code for /app/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[2]!/app/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[3]!/app/src/app/globals.css
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 Import trace for requested module:
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 ./src/app/globals.css
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81
2026-Feb-23 19:57:16.298824 [DEBUG] #13 23.81 > Build failed because of webpack errors
2026-Feb-23 19:57:16.427379 [DEBUG] #13 24.00 npm notice
2026-Feb-23 19:57:16.427379 [DEBUG] #13 24.00 npm notice New major version of npm available! 10.8.2 -> 11.10.1
2026-Feb-23 19:57:16.427379 [DEBUG] #13 24.00 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.10.1
2026-Feb-23 19:57:16.427379 [DEBUG] #13 24.00 npm notice To update run: npm install -g npm@11.10.1
2026-Feb-23 19:57:16.427379 [DEBUG] #13 24.00 npm notice
2026-Feb-23 19:57:16.627894 [DEBUG] #13 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
2026-Feb-23 19:57:16.627894 [DEBUG] ------
2026-Feb-23 19:57:16.627894 [DEBUG] > [builder 5/5] RUN npm run build:
2026-Feb-23 19:57:16.627894 [DEBUG] 23.81 Import trace for requested module:
2026-Feb-23 19:57:16.627894 [DEBUG] 23.81 ./src/app/globals.css
2026-Feb-23 19:57:16.627894 [DEBUG] 23.81
2026-Feb-23 19:57:16.627894 [DEBUG] 23.81
2026-Feb-23 19:57:16.627894 [DEBUG] 23.81 > Build failed because of webpack errors
2026-Feb-23 19:57:16.627894 [DEBUG] 24.00 npm notice
2026-Feb-23 19:57:16.627894 [DEBUG] 24.00 npm notice New major version of npm available! 10.8.2 -> 11.10.1
2026-Feb-23 19:57:16.627894 [DEBUG] 24.00 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.10.1
2026-Feb-23 19:57:16.627894 [DEBUG] 24.00 npm notice To update run: npm install -g npm@11.10.1
2026-Feb-23 19:57:16.627894 [DEBUG] 24.00 npm notice
2026-Feb-23 19:57:16.627894 [DEBUG] ------
2026-Feb-23 19:57:16.643194 [DEBUG] Dockerfile:25
2026-Feb-23 19:57:16.643194 [DEBUG] --------------------
2026-Feb-23 19:57:16.643194 [DEBUG] 23 |     COPY . .
2026-Feb-23 19:57:16.643194 [DEBUG] 24 |     ENV NEXT_TELEMETRY_DISABLED=1
2026-Feb-23 19:57:16.643194 [DEBUG] 25 | >>> RUN npm run build
2026-Feb-23 19:57:16.643194 [DEBUG] 26 |
2026-Feb-23 19:57:16.643194 [DEBUG] 27 |     FROM node:20-alpine AS runner
2026-Feb-23 19:57:16.643194 [DEBUG] --------------------
2026-Feb-23 19:57:16.643194 [DEBUG] ERROR: failed to build: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
2026-Feb-23 19:57:16.667723 [DEBUG] exit status 1
2026-Feb-23 19:57:16.774770 ========================================
2026-Feb-23 19:57:16.782115 Deployment failed: Command execution failed (exit code 1): docker exec q88kkscsgoggsockcs0g4o0k bash -c 'bash /artifacts/build.sh'
2026-Feb-23 19:57:16.782115 Error: #0 building with "default" instance using docker driver
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #1 [internal] load build definition from Dockerfile
2026-Feb-23 19:57:16.782115 #1 transferring dockerfile: 1.75kB done
2026-Feb-23 19:57:16.782115 #1 DONE 0.0s
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #2 [internal] load metadata for docker.io/library/node:20-alpine
2026-Feb-23 19:57:16.782115 #2 DONE 1.2s
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #3 [internal] load .dockerignore
2026-Feb-23 19:57:16.782115 #3 transferring context: 94B done
2026-Feb-23 19:57:16.782115 #3 DONE 0.0s
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #4 [internal] load build context
2026-Feb-23 19:57:16.782115 #4 transferring context: 143.31kB 0.0s done
2026-Feb-23 19:57:16.782115 #4 DONE 0.0s
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #5 [deps 1/4] FROM docker.io/library/node:20-alpine@sha256:09e2b3d9726018aecf269bd35325f46bf75046a643a66d28360ec71132750ec8
2026-Feb-23 19:57:16.782115 #5 resolve docker.io/library/node:20-alpine@sha256:09e2b3d9726018aecf269bd35325f46bf75046a643a66d28360ec71132750ec8 done
2026-Feb-23 19:57:16.782115 #5 sha256:eb87f4721c91769ed5206f34a9ab6ec98fc1d5235c12c2fc956665b1155e9ecb 0B / 1.26MB 0.1s
2026-Feb-23 19:57:16.782115 #5 sha256:e31b2016552274339ed88ed4a438d78bf37e0f6bdf328d02207b2a598c1ef86d 0B / 445B 0.1s
2026-Feb-23 19:57:16.782115 #5 sha256:09e2b3d9726018aecf269bd35325f46bf75046a643a66d28360ec71132750ec8 7.67kB / 7.67kB done
2026-Feb-23 19:57:16.782115 #5 sha256:c3324aa3efea082c8d294a93b97ba82adc5498a202bd48802f5a8af152e7dd9e 1.72kB / 1.72kB done
2026-Feb-23 19:57:16.782115 #5 sha256:458b0b7c1c6027b37124839bf527a5c54936ab27a9c9643051a3d801c4560a6c 6.52kB / 6.52kB done
2026-Feb-23 19:57:16.782115 #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 0B / 42.78MB 0.1s
2026-Feb-23 19:57:16.782115 #5 sha256:e31b2016552274339ed88ed4a438d78bf37e0f6bdf328d02207b2a598c1ef86d 445B / 445B 0.4s done
2026-Feb-23 19:57:16.782115 #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 8.39MB / 42.78MB 0.5s
2026-Feb-23 19:57:16.782115 #5 sha256:eb87f4721c91769ed5206f34a9ab6ec98fc1d5235c12c2fc956665b1155e9ecb 1.26MB / 1.26MB 0.6s done
2026-Feb-23 19:57:16.782115 #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 16.78MB / 42.78MB 0.7s
2026-Feb-23 19:57:16.782115 #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 23.07MB / 42.78MB 0.8s
2026-Feb-23 19:57:16.782115 #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 33.55MB / 42.78MB 1.0s
2026-Feb-23 19:57:16.782115 #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 41.94MB / 42.78MB 1.2s
2026-Feb-23 19:57:16.782115 #5 sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 42.78MB / 42.78MB 1.3s done
2026-Feb-23 19:57:16.782115 #5 extracting sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80
2026-Feb-23 19:57:16.782115 #5 extracting sha256:ad6d96c196e3198e14ea37df8bba4f54bf92fb525eb65e49fa4027c7dee13f80 1.5s done
2026-Feb-23 19:57:16.782115 #5 extracting sha256:eb87f4721c91769ed5206f34a9ab6ec98fc1d5235c12c2fc956665b1155e9ecb
2026-Feb-23 19:57:16.782115 #5 extracting sha256:eb87f4721c91769ed5206f34a9ab6ec98fc1d5235c12c2fc956665b1155e9ecb 0.1s done
2026-Feb-23 19:57:16.782115 #5 extracting sha256:e31b2016552274339ed88ed4a438d78bf37e0f6bdf328d02207b2a598c1ef86d done
2026-Feb-23 19:57:16.782115 #5 DONE 3.4s
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #6 [deps 2/4] WORKDIR /app
2026-Feb-23 19:57:16.782115 #6 DONE 0.1s
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #7 [deps 3/4] COPY package.json package-lock.json* ./
2026-Feb-23 19:57:16.782115 #7 DONE 0.1s
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #8 [runner 3/6] RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
2026-Feb-23 19:57:16.782115 #8 DONE 0.3s
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #9 [deps 4/4] RUN npm ci --legacy-peer-deps
2026-Feb-23 19:57:16.782115 #9 ...
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #10 [runner 4/6] RUN mkdir -p ./public
2026-Feb-23 19:57:16.782115 #10 DONE 0.2s
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #9 [deps 4/4] RUN npm ci --legacy-peer-deps
2026-Feb-23 19:57:16.782115 #9 16.73 npm warn deprecated next@14.2.5: This version has a security vulnerability. Please upgrade to a patched version. See https://nextjs.org/blog/security-update-2025-12-11 for more details.
2026-Feb-23 19:57:16.782115 #9 16.82
2026-Feb-23 19:57:16.782115 #9 16.82 added 132 packages, and audited 133 packages in 16s
2026-Feb-23 19:57:16.782115 #9 16.82
2026-Feb-23 19:57:16.782115 #9 16.82 89 packages are looking for funding
2026-Feb-23 19:57:16.782115 #9 16.82   run `npm fund` for details
2026-Feb-23 19:57:16.782115 #9 16.95
2026-Feb-23 19:57:16.782115 #9 16.95 1 critical severity vulnerability
2026-Feb-23 19:57:16.782115 #9 16.95
2026-Feb-23 19:57:16.782115 #9 16.95 To address all issues, run:
2026-Feb-23 19:57:16.782115 #9 16.95   npm audit fix --force
2026-Feb-23 19:57:16.782115 #9 16.95
2026-Feb-23 19:57:16.782115 #9 16.95 Run `npm audit` for details.
2026-Feb-23 19:57:16.782115 #9 16.96 npm notice
2026-Feb-23 19:57:16.782115 #9 16.96 npm notice New major version of npm available! 10.8.2 -> 11.10.1
2026-Feb-23 19:57:16.782115 #9 16.96 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.10.1
2026-Feb-23 19:57:16.782115 #9 16.96 npm notice To update run: npm install -g npm@11.10.1
2026-Feb-23 19:57:16.782115 #9 16.96 npm notice
2026-Feb-23 19:57:16.782115 #9 DONE 17.2s
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #11 [builder 3/5] COPY --from=deps /app/node_modules ./node_modules
2026-Feb-23 19:57:16.782115 #11 DONE 6.8s
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #12 [builder 4/5] COPY . .
2026-Feb-23 19:57:16.782115 #12 DONE 0.0s
2026-Feb-23 19:57:16.782115 
2026-Feb-23 19:57:16.782115 #13 [builder 5/5] RUN npm run build
2026-Feb-23 19:57:16.782115 #13 0.995
2026-Feb-23 19:57:16.782115 #13 0.995 > greens-ai@1.0.0 build
2026-Feb-23 19:57:16.782115 #13 0.995 > next build
2026-Feb-23 19:57:16.782115 #13 0.995
2026-Feb-23 19:57:16.782115 #13 2.061   ▲ Next.js 14.2.5
2026-Feb-23 19:57:16.782115 #13 2.061
2026-Feb-23 19:57:16.782115 #13 2.079    Creating an optimized production build ...
2026-Feb-23 19:57:16.782115 #13 23.81 Failed to compile.
2026-Feb-23 19:57:16.782115 #13 23.81
2026-Feb-23 19:57:16.782115 #13 23.81 ./src/app/globals.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[3]!./src/app/globals.css
2026-Feb-23 19:57:16.782115 #13 23.81 Error: Cannot find module 'tailwindcss'
2026-Feb-23 19:57:16.782115 #13 23.81 Require stack:
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack/config/blocks/css/index.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack/config/index.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack-config.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack/plugins/next-trace-entrypoints-plugin.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/collect-build-traces.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/index.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/cli/next-build.js
2026-Feb-23 19:57:16.782115 #13 23.81     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
2026-Feb-23 19:57:16.782115 #13 23.81     at /app/node_modules/next/dist/server/require-hook.js:55:36
2026-Feb-23 19:57:16.782115 #13 23.81     at Function.resolve (node:internal/modules/helpers:193:19)
2026-Feb-23 19:57:16.782115 #13 23.81     at loadPlugin (/app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:49:32)
2026-Feb-23 19:57:16.782115 #13 23.81     at /app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:157:56
2026-Feb-23 19:57:16.782115 #13 23.81     at Array.map (<anonymous>)
2026-Feb-23 19:57:16.782115 #13 23.81     at getPostCssPlugins (/app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:157:47)
2026-Feb-23 19:57:16.782115 #13 23.81     at async /app/node_modules/next/dist/build/webpack/config/blocks/css/index.js:124:36
2026-Feb-23 19:57:16.782115 #13 23.81     at async /app/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js:51:40
2026-Feb-23 19:57:16.782115 #13 23.81     at async Span.traceAsyncFn (/app/node_modules/next/dist/trace/trace.js:154:20)
2026-Feb-23 19:57:16.782115 #13 23.81
2026-Feb-23 19:57:16.782115 #13 23.81 Import trace for requested module:
2026-Feb-23 19:57:16.782115 #13 23.81 ./src/app/globals.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[3]!./src/app/globals.css
2026-Feb-23 19:57:16.782115 #13 23.81 ./src/app/globals.css
2026-Feb-23 19:57:16.782115 #13 23.81
2026-Feb-23 19:57:16.782115 #13 23.81 ./src/app/globals.css
2026-Feb-23 19:57:16.782115 #13 23.81 Error: Cannot find module 'tailwindcss'
2026-Feb-23 19:57:16.782115 #13 23.81 Require stack:
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack/config/blocks/css/index.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack/config/index.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack-config.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack/plugins/next-trace-entrypoints-plugin.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/collect-build-traces.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/index.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/cli/next-build.js
2026-Feb-23 19:57:16.782115 #13 23.81     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
2026-Feb-23 19:57:16.782115 #13 23.81     at /app/node_modules/next/dist/server/require-hook.js:55:36
2026-Feb-23 19:57:16.782115 #13 23.81     at Function.resolve (node:internal/modules/helpers:193:19)
2026-Feb-23 19:57:16.782115 #13 23.81     at loadPlugin (/app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:49:32)
2026-Feb-23 19:57:16.782115 #13 23.81     at /app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:157:56
2026-Feb-23 19:57:16.782115 #13 23.81     at Array.map (<anonymous>)
2026-Feb-23 19:57:16.782115 #13 23.81     at getPostCssPlugins (/app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:157:47)
2026-Feb-23 19:57:16.782115 #13 23.81     at async /app/node_modules/next/dist/build/webpack/config/blocks/css/index.js:124:36
2026-Feb-23 19:57:16.782115 #13 23.81     at async /app/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js:51:40
2026-Feb-23 19:57:16.782115 #13 23.81     at async Span.traceAsyncFn (/app/node_modules/next/dist/trace/trace.js:154:20)
2026-Feb-23 19:57:16.782115 #13 23.81     at tryRunOrWebpackError (/app/node_modules/next/dist/compiled/webpack/bundle5.js:28:312989)
2026-Feb-23 19:57:16.782115 #13 23.81     at __webpack_require_module__ (/app/node_modules/next/dist/compiled/webpack/bundle5.js:28:131165)
2026-Feb-23 19:57:16.782115 #13 23.81     at __nested_webpack_require_153728__ (/app/node_modules/next/dist/compiled/webpack/bundle5.js:28:130607)
2026-Feb-23 19:57:16.782115 #13 23.81     at /app/node_modules/next/dist/compiled/webpack/bundle5.js:28:131454
2026-Feb-23 19:57:16.782115 #13 23.81     at symbolIterator (/app/node_modules/next/dist/compiled/neo-async/async.js:1:14444)
2026-Feb-23 19:57:16.782115 #13 23.81     at done (/app/node_modules/next/dist/compiled/neo-async/async.js:1:14824)
2026-Feb-23 19:57:16.782115 #13 23.81     at Hook.eval [as callAsync] (eval at create (/app/node_modules/next/dist/compiled/webpack/bundle5.js:13:28858), <anonymous>:15:1)
2026-Feb-23 19:57:16.782115 #13 23.81     at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (/app/node_modules/next/dist/compiled/webpack/bundle5.js:13:26012)
2026-Feb-23 19:57:16.782115 #13 23.81     at /app/node_modules/next/dist/compiled/webpack/bundle5.js:28:130328
2026-Feb-23 19:57:16.782115 #13 23.81     at symbolIterator (/app/node_modules/next/dist/compiled/neo-async/async.js:1:14402)
2026-Feb-23 19:57:16.782115 #13 23.81 -- inner error --
2026-Feb-23 19:57:16.782115 #13 23.81 Error: Cannot find module 'tailwindcss'
2026-Feb-23 19:57:16.782115 #13 23.81 Require stack:
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack/config/blocks/css/index.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack/config/index.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack-config.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/webpack/plugins/next-trace-entrypoints-plugin.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/collect-build-traces.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/build/index.js
2026-Feb-23 19:57:16.782115 #13 23.81 - /app/node_modules/next/dist/cli/next-build.js
2026-Feb-23 19:57:16.782115 #13 23.81     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
2026-Feb-23 19:57:16.782115 #13 23.81     at /app/node_modules/next/dist/server/require-hook.js:55:36
2026-Feb-23 19:57:16.782115 #13 23.81     at Function.resolve (node:internal/modules/helpers:193:19)
2026-Feb-23 19:57:16.782115 #13 23.81     at loadPlugin (/app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:49:32)
2026-Feb-23 19:57:16.782115 #13 23.81     at /app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:157:56
2026-Feb-23 19:57:16.782115 #13 23.81     at Array.map (<anonymous>)
2026-Feb-23 19:57:16.782115 #13 23.81     at getPostCssPlugins (/app/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:157:47)
2026-Feb-23 19:57:16.782115 #13 23.81     at async /app/node_modules/next/dist/build/webpack/config/blocks/css/index.js:124:36
2026-Feb-23 19:57:16.782115 #13 23.81     at async /app/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js:51:40
2026-Feb-23 19:57:16.782115 #13 23.81     at async Span.traceAsyncFn (/app/node_modules/next/dist/trace/trace.js:154:20)
2026-Feb-23 19:57:16.782115 #13 23.81     at Object.<anonymous> (/app/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[2]!/app/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[3]!/app/src/app/globals.css:1:7)
2026-Feb-23 19:57:16.782115 #13 23.81     at /app/node_modules/next/dist/compiled/webpack/bundle5.js:28:922493
2026-Feb-23 19:57:16.782115 #13 23.81     at Hook.eval [as call] (eval at create (/app/node_modules/next/dist/compiled/webpack/bundle5.js:13:28636), <anonymous>:7:1)
2026-Feb-23 19:57:16.782115 #13 23.81     at Hook.CALL_DELEGATE [as _call] (/app/node_modules/next/dist/compiled/webpack/bundle5.js:13:25906)
2026-Feb-23 19:57:16.782115 #13 23.81     at /app/node_modules/next/dist/compiled/webpack/bundle5.js:28:131198
2026-Feb-23 19:57:16.782115 #13 23.81     at tryRunOrWebpackError (/app/node_modules/next/dist/compiled/webpack/bundle5.js:28:312943)
2026-Feb-23 19:57:16.782115 #13 23.81     at __webpack_require_module__ (/app/node_modules/next/dist/compiled/webpack/bundle5.js:28:131165)
2026-Feb-23 19:57:16.782115 #13 23.81     at __nested_webpack_require_153728__ (/app/node_modules/next/dist/compiled/webpack/bundle5.js:28:130607)
2026-Feb-23 19:57:16.782115 #13 23.81     at /app/node_modules/next/dist/compiled/webpack/bundle5.js:28:131454
2026-Feb-23 19:57:16.782115 #13 23.81     at symbolIterator (/app/node_modules/next/dist/compiled/neo-async/async.js:1:14444)
2026-Feb-23 19:57:16.782115 #13 23.81
2026-Feb-23 19:57:16.782115 #13 23.81 Generated code for /app/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[2]!/app/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[12].use[3]!/app/src/app/globals.css
2026-Feb-23 19:57:16.782115 #13 23.81
2026-Feb-23 19:57:16.782115 #13 23.81 Import trace for requested module:
2026-Feb-23 19:57:16.782115 #13 23.81 ./src/app/globals.css
2026-Feb-23 19:57:16.782115 #13 23.81
2026-Feb-23 19:57:16.782115 #13 23.81
2026-Feb-23 19:57:16.782115 #13 23.81 > Build failed because of webpack errors
2026-Feb-23 19:57:16.782115 #13 24.00 npm notice
2026-Feb-23 19:57:16.782115 #13 24.00 npm notice New major version of npm available! 10.8.2 -> 11.10.1
2026-Feb-23 19:57:16.782115 #13 24.00 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.10.1
2026-Feb-23 19:57:16.782115 #13 24.00 npm notice To update run: npm install -g npm@11.10.1
2026-Feb-23 19:57:16.782115 #13 24.00 npm notice
2026-Feb-23 19:57:16.782115 #13 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
2026-Feb-23 19:57:16.782115 ------
2026-Feb-23 19:57:16.782115 > [builder 5/5] RUN npm run build:
2026-Feb-23 19:57:16.782115 23.81 Import trace for requested module:
2026-Feb-23 19:57:16.782115 23.81 ./src/app/globals.css
2026-Feb-23 19:57:16.782115 23.81
2026-Feb-23 19:57:16.782115 23.81
2026-Feb-23 19:57:16.782115 23.81 > Build failed because of webpack errors
2026-Feb-23 19:57:16.782115 24.00 npm notice
2026-Feb-23 19:57:16.782115 24.00 npm notice New major version of npm available! 10.8.2 -> 11.10.1
2026-Feb-23 19:57:16.782115 24.00 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.10.1
2026-Feb-23 19:57:16.782115 24.00 npm notice To update run: npm install -g npm@11.10.1
2026-Feb-23 19:57:16.782115 24.00 npm notice
2026-Feb-23 19:57:16.782115 ------
2026-Feb-23 19:57:16.782115 Dockerfile:25
2026-Feb-23 19:57:16.782115 --------------------
2026-Feb-23 19:57:16.782115 23 |     COPY . .
2026-Feb-23 19:57:16.782115 24 |     ENV NEXT_TELEMETRY_DISABLED=1
2026-Feb-23 19:57:16.782115 25 | >>> RUN npm run build
2026-Feb-23 19:57:16.782115 26 |
2026-Feb-23 19:57:16.782115 27 |     FROM node:20-alpine AS runner
2026-Feb-23 19:57:16.782115 --------------------
2026-Feb-23 19:57:16.782115 ERROR: failed to build: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
2026-Feb-23 19:57:16.782115 exit status 1
2026-Feb-23 19:57:16.788816 [DEBUG] Error type: RuntimeException
2026-Feb-23 19:57:16.795577 [DEBUG] Error code: 0
2026-Feb-23 19:57:16.801799 [DEBUG] Location: /var/www/html/app/Traits/ExecuteRemoteCommand.php:243
2026-Feb-23 19:57:16.809065 [DEBUG] Stack trace (first 5 lines):
2026-Feb-23 19:57:16.815338 [DEBUG] #0 /var/www/html/app/Traits/ExecuteRemoteCommand.php(104): App\Jobs\ApplicationDeploymentJob->executeCommandWithProcess()
2026-Feb-23 19:57:16.822301 [DEBUG] #1 /var/www/html/vendor/laravel/framework/src/Illuminate/Collections/Traits/EnumeratesValues.php(271): App\Jobs\ApplicationDeploymentJob->{closure:App\Traits\ExecuteRemoteCommand::execute_remote_command():71}()
2026-Feb-23 19:57:16.828351 [DEBUG] #2 /var/www/html/app/Traits/ExecuteRemoteCommand.php(71): Illuminate\Support\Collection->each()
2026-Feb-23 19:57:16.834345 [DEBUG] #3 /var/www/html/app/Jobs/ApplicationDeploymentJob.php(3163): App\Jobs\ApplicationDeploymentJob->execute_remote_command()
2026-Feb-23 19:57:16.841509 [DEBUG] #4 /var/www/html/app/Jobs/ApplicationDeploymentJob.php(854): App\Jobs\ApplicationDeploymentJob->build_image()
2026-Feb-23 19:57:16.848466 ========================================
2026-Feb-23 19:57:16.854839 Deployment failed. Removing the new version of your application.
2026-Feb-23 19:57:17.436349 Gracefully shutting down build container: q88kkscsgoggsockcs0g4o0k
2026-Feb-23 19:57:17.853923 [DEBUG] [CMD]: docker stop -t 30 q88kkscsgoggsockcs0g4o0k
2026-Feb-23 19:57:17.853923 [DEBUG] q88kkscsgoggsockcs0g4o0k