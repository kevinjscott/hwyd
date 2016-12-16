`environment nodemon server.js` or `environment gulp`

`environment nodemon --inspect --debug-brk server.js`

`docker build -t kevinjscott/hwyd-dev .; docker push kevinjscott/hwyd-dev; eb deploy --version Dockerrun.aws`

`eb create kevtest-node3 -p node.js -v --envvars NODE_ENV=development,NPM_CONFIG_PRODUCTION=true` (along with the other comma-separated environment variables)
