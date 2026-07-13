FROM node:24

WORKDIR /app

RUN npm install -g nodemon

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3003

CMD ["npm", "run", "dev"]
