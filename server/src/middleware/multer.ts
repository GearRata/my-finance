// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.

import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export default upload;

// Note:
// destination ใช้กำหนดว่าจะเก็บไฟล์ที่อัปโหลดไว้ใน folder ไหน สามารถส่งเป็น string ได้เลย
// เช่น '/tmp/uploads' ถ้าไม่กำหนด destination เลย multer จะใช้ folder temp ของ OS แทน

// filename ใช้กำหนด ชื่อไฟล์ ที่จะบันทึกใน folder นั้น ถ้าไม่กำหนด multer จะตั้งชื่อแบบสุ่มให้ โดย ไม่มีนามสกุลไฟล์

// ทั้งสอง function จะได้รับ req และ ข้อมูลของไฟล์ (file) เป็น argument เพื่อใช้ในการตัดสินใจ
