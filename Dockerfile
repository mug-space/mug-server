FROM public.ecr.aws/lambda/nodejs:20

COPY . ./

RUN yarn
RUN yarn build
ENV NODE_ENV production
CMD ["dist/lambda.handler"]

# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY . .
# RUN apk add --no-cache vips-dev
# RUN apk add --no-cache fftw-dev build-base --repository https://alpine.global.ssl.fastly.net/alpine/edge/community/

# RUN yarn build

# FROM node:20-alpine AS runner
# WORKDIR /app
# RUN apk add --update --no-cache \
#     make \
#     g++ \
#     jpeg-dev \
#     cairo-dev \
#     giflib-dev \
#     pango-dev \
#     libtool \
#     autoconf \
#     automake \
#     fontconfig
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/package.json ./
# COPY --from=builder /app/yarn.lock* ./
# COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.1 /lambda-adapter /opt/extensions/lambda-adapter
# ENV NODE_ENV production
# CMD ["dist/lambda.handler"]

# EXPOSE 8000

# ENV PORT 8000
# ENV HOST=0.0.0.0 PORT=8000 NODE_ENV=production

# CMD ["node", "dist/main.js"]

