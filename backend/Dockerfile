FROM node:latest

WORKDIR /app
COPY package*.json ./
RUN npm i

COPY . .

EXPOSE 3000
CMD ["sh", "-c", "npm run db:deploy && npm run dev"]