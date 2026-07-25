# Define base image เป็น Node.js version 20 แบบ Alpine (เป็นระบบปฎิบัติการเล็กและเบา (~5MB))
FROM node:20-alpine AS base

# กำหนด Working Directory ภายใน Container
WORKDIR /app

# สร้าง Stage ใหม่ชื่อ "deps" โดยใช้ base เป็นฐาน
FROM base AS deps
# copy package.json และ package-lock.json เพิ่มไปยัง Working Directory
COPY package*.json ./

RUN npm ci

FROM deps AS builder
# Copy Source Code ทั้งหมดไปยัง Working Directory (. ตัวแรกคือ source directory on the host machine, ตัวที่สองคือ destination directory within the container)
COPY . .

RUN npm run build


FROM base AS production


ENV NODE_ENV=production

# Copy เฉพาะ package files สำหรับติดตั้ง prod deps
COPY package*.json ./

# ติดตั้งเฉพาะ production dependencies เท่านั้น
# --omit=dev = ไม่ติดตั้ง typescript, tsx, @types/* ฯลฯ
# npm cache clean = ลบ cache เพื่อลดขนาด Image
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist

# เปิด port 5000 ให้ Container
EXPOSE 5000

# กำหนดคำสั่งที่จะให้รันเมื่อ Container เริ่มทำงาน
CMD ["node", "dist/server.js"]
