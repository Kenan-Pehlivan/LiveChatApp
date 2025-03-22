FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --force

COPY . .

# BCRYPT im Container neu installieren
RUN npm rebuild bcrypt --build-from-source


EXPOSE 8756

CMD ["npm", "run", "dev"]