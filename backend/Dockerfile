FROM node:latest

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npx prisma generate


EXPOSE 3035

CMD ["npm", "start"]
# CMD ["npm", "run", "dev"]