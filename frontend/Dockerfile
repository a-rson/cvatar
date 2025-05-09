FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --host allows access from outside the container 
CMD ["npm", "run", "dev", "--", "--host"]