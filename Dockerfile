## BUILDING
##   (from project root directory)
##   $ docker build -t node-js-for-kevinjscott-hwyd .
##
## RUNNING
##   $ docker run -p 3000:3000 node-js-for-kevinjscott-hwyd
##
## CONNECTING
##   Lookup the IP of your active docker host using:
##     $ docker-machine ip $(docker-machine active)
##   Connect to the container at DOCKER_IP:3000
##     replacing DOCKER_IP for the IP of your active docker host

FROM gcr.io/stacksmith-images/debian-buildpack:wheezy-r10

MAINTAINER Bitnami <containers@bitnami.com>

ENV STACKSMITH_STACK_ID="0r0lgov" \
    STACKSMITH_STACK_NAME="Node.js for kevinjscott/hwyd" \
    STACKSMITH_STACK_PRIVATE="1"

RUN bitnami-pkg install node-7.0.0-0 --checksum 8049e447c9ac3cbf74b2ea7602e7126b6e5610b2f2c7b0e5f3ad18710eca4108

ENV PATH=/opt/bitnami/node/bin:/opt/bitnami/python/bin:$PATH \
    NODE_PATH=/opt/bitnami/node/lib/node_modules

## STACKSMITH-END: Modifications below this line will be unchanged when regenerating

# ExpressJS template
COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
