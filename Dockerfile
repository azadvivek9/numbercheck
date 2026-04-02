FROM ghcr.io/puppeteer/puppeteer:latest

USER root

# Working directory set karein
WORKDIR /usr/src/app

# Package files copy karein
COPY package*.json ./

# Dependencies install karein
RUN npm install

# Saara code copy karein
COPY . .

# Chrome ka path environment variable mein set kar dete hain (Safety ke liye)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

EXPOSE 3000

CMD [ "node", "index.js" ]
