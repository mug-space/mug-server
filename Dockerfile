# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Create the final image
FROM public.ecr.aws/lambda/nodejs:20

# Set the working directory
WORKDIR /var/task

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Command to run the Lambda function
CMD ["dist/lambda.handler"]
