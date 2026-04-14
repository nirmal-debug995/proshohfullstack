# ===============================
# BASE IMAGE
# ===============================
FROM node:18

# ===============================
# WORKDIR
# ===============================
WORKDIR /app

# ===============================
# COPY ROOT PACKAGE FILES
# ===============================
COPY package*.json ./
RUN npm install

# ===============================
# COPY FULL PROJECT
# ===============================
COPY . .

# ===============================
# BUILD FRONTEND
# ===============================
RUN npm install --prefix frontend
RUN npm run build --prefix frontend

# ===============================
# MOVE BUILD TO BACKEND
# ===============================
RUN rm -rf backend/frontend || true
RUN mkdir -p backend/frontend
RUN cp -r frontend/build backend/frontend/

# ===============================
# PORT
# ===============================
EXPOSE 5000

# ===============================
# START SERVER
# ===============================
CMD ["node", "backend/server.js"]
