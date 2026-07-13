FROM node:24

WORKDIR /app

# ffmpeg incluye ffprobe — necesario para validar duración de videos en ConfirmarVideoCommandUsesCase
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

RUN npm install -g nodemon

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "run", "dev"]
