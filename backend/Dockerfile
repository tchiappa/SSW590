# DEVELOPMENT DOCKERFILE
FROM node:25-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "dev"]