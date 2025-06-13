FROM node:22.3.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN apt-get update && apt-get install -y build-essential

EXPOSE 8000
CMD ["npm", "start"]
