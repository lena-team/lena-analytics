# uses node version 6.11 as base image
FROM node:latest

# copies server files into 
COPY . /home/node/app

# change current directory to /home/node/app
WORKDIR /home/node/app

# run npm install
RUN npm install

# exposes internal port 1337
EXPOSE 1337

# run npm start
CMD ["npm", "start"]
