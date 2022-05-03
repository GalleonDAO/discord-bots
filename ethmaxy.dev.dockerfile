FROM node:alpine

COPY package*.json ./
RUN npm install
RUN npm install -D

COPY /bots .

EXPOSE 80
CMD [ "node", "ethmaxy.js" ]
