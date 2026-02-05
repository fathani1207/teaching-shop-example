# =====================
# Stage 1: Build
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (cache layer)
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build


# =====================
# Stage 2: Production
# =====================
FROM nginx:alpine

# Copy built files into nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
