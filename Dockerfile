FROM node:20-alpine

WORKDIR /app

# Copy dependencies file first for better layer  caching

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install Dependencies
RUN \
if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
  else echo "No lockfile found" && exit 1; \
  fi

  # copy source code
  COPY . .

  RUN npm run build

  EXPOSE 3000

  CMD ["npm", "start"]
