FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
RUN mkdir -p /usr/src/app/data
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]


