# Stage 1: Install dependencies & build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy only frontend package.json (standalone, no workspace)
COPY package.json ./

# Install deps from public npm registry
RUN npm install --registry https://registry.npmjs.org/

# Copy source
COPY . .

# Build (VITE_API_URL empty — nginx proxies /api to backend)
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
