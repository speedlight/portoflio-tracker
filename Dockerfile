FROM node:14.17.0-alpine

WORKDIR /app 
COPY . . 

RUN npm install
    
EXPOSE 3000

CMD npm start 
