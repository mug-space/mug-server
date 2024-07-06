# FROM public.ecr.aws/lambda/nodejs:20-arm64
# WORKDIR ${LAMBDA_TASK_ROOT}
# COPY . .
# RUN npm install -g yarn
# RUN yarn
# ENV NODE_ENV production
# RUN yarn build
# CMD ["dist/lambda.handler"]


# FROM public.ecr.aws/lambda/nodejs:20-arm64 AS builder
# WORKDIR ${LAMBDA_TASK_ROOT}
# COPY . .
# RUN npm install -g yarn
# #RUN sudo yum install gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel
# # RUN dnf install -y gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel
# # RUN dnf install make automake gcc gcc-c++ kernel-devel
# # RUN dnf install @development-tools
# # RUN dnf install libcairo2-dev 
# RUN dnf update 
# RUN dnf install libpango1.0-dev 
# RUN dnf install libjpeg-dev 
# RUN dnf install libgif-dev 
# RUN dnf install librsvg2-dev
# RUN yarn
# ENV NODE_ENV production
# RUN yarn build

# FROM public.ecr.aws/lambda/nodejs:20-arm64 AS runner
# WORKDIR ${LAMBDA_TASK_ROOT}
# COPY --from=builder /${LAMBDA_TASK_ROOT}/node_modules ./node_modules
# COPY --from=builder /${LAMBDA_TASK_ROOT}/dist ./dist
# COPY --from=builder /${LAMBDA_TASK_ROOT}/package.json ./
# COPY --from=builder /${LAMBDA_TASK_ROOT}/yarn.lock* ./
# ENV NODE_ENV production
# CMD ["dist/lambda.handler"]



FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN apk add --no-cache vips-dev  
RUN apk add --no-cache fftw-dev build-base --repository https://alpine.global.ssl.fastly.net/alpine/edge/community/
RUN yarn add sharp

RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake \
    fontconfig
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock* ./
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.1 /lambda-adapter /opt/extensions/lambda-adapter
ENV NODE_ENV production
# CMD ["dist/lambda.handler"]

EXPOSE 8000

ENV PORT 8000
ENV HOST=0.0.0.0 PORT=8000 NODE_ENV=production

CMD ["node", "dist/main.js"]

