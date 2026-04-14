FROM node:18

WORKDIR /app

# Copy root package.json
COPY package*.json ./
RUN npm install

# Copy backend + frontend
COPY backend ./backend
COPY frontend ./frontend

# Build frontend
RUN npm run build --prefix frontend

EXPOSE 5000

CMD ["node", "backend/server.js"]
