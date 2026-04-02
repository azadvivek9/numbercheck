FROM ghcr.io/puppeteer/puppeteer:latest

USER root
WORKDIR /usr/src/app

# Dependencies copy karein
COPY package*.json ./
RUN npm install

# Saara code copy karein
COPY . .

# Port expose karein (Render ke liye)
EXPOSE 3000

CMD [ "node", "index.js" ]
