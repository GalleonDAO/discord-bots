FROM node:lts-alpine
ENV NODE_ENV=production
COPY ["package*.json", "./"]
RUN npm install --production --silent

COPY ["/src", "./src"]

EXPOSE 80
CMD npm run start