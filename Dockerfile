# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=23.9.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /home/node/app

COPY package*.json ./

RUN yarn

RUN yarn global add @nestjs/cli

COPY . .

# Build the NestJS application
RUN nest build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]