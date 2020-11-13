FROM node:12-alpine
WORKDIR /RestAPI
COPY . .
RUN npm install
RUN npm install bcrypt
CMD ["node", "server.js"]