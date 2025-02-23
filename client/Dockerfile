FROM node:23.8.0

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --force

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]