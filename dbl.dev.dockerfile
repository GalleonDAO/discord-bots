FROM nginx:latest

COPY package*.json ./
RUN npm install
RUN npm install -D

COPY .env .
COPY /bots .

EXPOSE 80
CMD [ "node", "dbl.js" ]
