FROM node:16-slim

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .

RUN mkdir -p /jeel_PV_dir

EXPOSE 6000

CMD ["node", "server.js"]