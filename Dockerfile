FROM node:13.8.0-stretch-slim

# Create app directory
WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY backend/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 4000
