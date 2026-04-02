import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      // ระบุโครงสร้างของ user ที่คุณใช้ในโปรเจกต์
      user: {
        id: number;
        email: string;
        role: string;
        enabled: boolean;
        created_at?: Date;
      };
      images?: Array<{
        asset_id: string;
        public_id: string;
        url: string;
        secure_url: string;
      }>;
    }
  }
}
