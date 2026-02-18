# Define base image เป็น Node.js version 20 แบบ Alpine (เป็นระบบปฎิบัติการเล็กและเบา (~5MB))
FROM node:20-alpine

# กำหนด Working Directory ภายใน Container
WORKDIR /app

# copy package.json และ package-lock.json เพิ่มไปยัง Working Directory
COPY package*.json ./

# ติดตั้ง Dependencies
RUN npm install

# Copy Source Code ทั้งหมดไปยัง Working Directory (. ตัวแรกคือ source directory on the host machine, ตัวที่สองคือ destination directory within the container)
COPY . .

# เปิด port 5000 ให้ Container
EXPOSE 5000

# กำหนดคำสั่งที่จะให้รันเมื่อ Container เริ่มทำงาน
CMD ["npm", "run", "dev"]
