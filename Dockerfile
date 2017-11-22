# uses node version 8 as base image
FROM node:8.9.0-alpine

# image information
LABEL maintainer="eugene@soo.sg" \
      version="1.0" \
      description="nodeJs image for Analytics service server"

# copies server files into 
COPY package.json package-lock.json /home/node/app/

# change current directory to /home/node/app
WORKDIR /home/node/app

# run npm install
RUN npm install && npm cache verify && npm cache clean --force

# exposes internal port 1337
EXPOSE 1337

# run npm start when container runs
CMD ["npm", "start"]

# check health of container when container runs
HEALTHCHECK --interval=10s \
  CMD curl -f http://localhost:1337/ || exit 1
