FROM node:15
WORKDIR /app

#little trick to speedup the process: since dependencies do not change very
#often and the result are cached this step is bypassed
COPY package.json .

# from docker-compose build/args/node_env 
ARG NODE_ENV           

#RUN npm install --only=prod;
RUN if [ "$NODE_ENV" == "development" ]; \
        then npm install; \
        else npm install --only=prod; \
    fi

#since our code is the only part that is going to change very frequently i decoupled that
#from copying package.json so it's probable that it's going to use the cached result
#and this copy will take infinite less time 
COPY . ./

ENV PORT 3000
EXPOSE $PORT

#since we installed nodemon we need to get that started with "npm", "run", "startdev" as in the package.json: "startdev": "nodemon index.js",
#CMD ["node", "index.js"]
CMD ["npm", "run", "startdev"]