# Puppeteer ki official image jisme Chrome pehle se hota hai
FROM ghcr.io/puppeteer/puppeteer:latest

USER root
WORKDIR /usr/src/app

# Package files copy karke install karein
COPY package*.json ./
RUN npm install

# Baaki saara code copy karein
COPY . .

# Environment variable set karein taaki Puppeteer ko Chrome mil jaye
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

EXPOSE 3000

CMD [ "node", "index.js" ]
