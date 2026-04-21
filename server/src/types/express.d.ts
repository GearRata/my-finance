import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      // ระบุโครงสร้างของ user
      user: {
        id: number;
        email: string;
        username: string;
        role: string;
        enabled: boolean;
      };
      images?: Array<{
        asset_id: string;
        public_id: string;
        url: string;
        secure_url: string;
      }>;
      has_account?: number | undefined;
    }
  }
}
