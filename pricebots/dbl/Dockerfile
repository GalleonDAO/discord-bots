FROM node:lts-alpine

ENV NODE_ENV=production
COPY ["package*.json", "./"]
RUN npm install --production --silent && mv node_modules ../

COPY ["/src", "."]

EXPOSE 80
CMD ["node", "dbl.js"]