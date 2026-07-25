import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import os from "os";
import FormData from "form-data";
import axios from "axios";
import * as TransactionService from "./transactions.service.js";
import * as AccountService from "./accounts.service.js";
import * as CategoryService from "./categories.service.js";
import * as AuthService from "./auth.service.js";
import { redisClient } from "../config/db.js";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// ===== Interface & State =====

interface PendingSlip {
  userId: number;
  amount: number;
  sender: string;
  receiver: string;
  transDate: string;
  note: string;
  accountId?: number;
  categoryId?: number;
  step:
    | "select_account"
    | "select_category"
    | "edit_note"
    | "waiting_note"
    | "done";
}

// chatId → userId (ผูก Telegram กับ DB)
const loggedInUsers = new Map<number, number>();

// chatId → ข้อมูลสลิปชั่วคราว
const pendingSlips = new Map<number, PendingSlip>();

// ===== Helper: ดึง Quota ที่เหลือจาก SlipOK =====
const getSlipOkQuota = async (): Promise<string> => {
  try {
    const res = await axios.get(`${process.env.SLIPOK_API}/quota`, {
      headers: { "x-authorization": `${process.env.SLIPOK_API_KEY}` },
    });
    const quota = res.data?.data?.quota ?? "ไม่ทราบ";
    return `🎫 โควต้าสแกนสลิปคงเหลือ: *${quota} ครั้ง*`;
  } catch {
    return "⚠️ ไม่สามารถตรวจสอบโควต้าได้";
  }
};

// ===== Main =====

export const startTelegramBot = () => {
  if (!BOT_TOKEN) {
    console.log("⚠️  TELEGRAM_BOT_TOKEN not found — Telegram Bot disabled");
    return;
  }

  const bot = new TelegramBot(BOT_TOKEN, { polling: true });
  console.log("🤖 Telegram Bot is running (polling mode)");

  // ========================================
  // /start — แสดงข้อความต้อนรับ
  // ========================================
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const isLoggedIn = loggedInUsers.has(chatId);

    await bot.sendMessage(
      chatId,
      [
        `สวัสดีครับ! 🎉`,
        ``,
        isLoggedIn ? `✅ คุณล็อกอินอยู่แล้ว` : `🔐 กรุณาล็อกอินก่อนใช้งาน:`,
        isLoggedIn ? `` : `/login <email> <password>`,
        ``,
        `📷 ส่งรูปสลิปเพื่อบันทึกรายการ`,
        `/quota — ดูจำนวนครั้งที่เหลือ`,
        `/logout — ออกจากระบบ`,
      ].join("\n"),
      { parse_mode: "Markdown" },
    );
  });

  // ========================================
  // /login <email> <password>
  // ========================================
  bot.onText(/\/login(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;

    // ลบข้อความทันทีเสมอ ไม่ว่าจะพิมพ์ถูกหรือผิด (ซ่อน credentials)
    try {
      await bot.deleteMessage(chatId, msg.message_id);
    } catch {
      // อาจไม่มีสิทธิ์ลบใน group
    }

    // เช็คว่า login อยู่แล้วหรือยัง
    if (loggedInUsers.has(chatId)) {
      await bot.sendMessage(chatId, "✅ คุณล็อกอินอยู่แล้ว");
      return;
    }

    // ตัดช่องว่างหน้า-หลังออก แล้ว split
    const rawArgs = match?.[1]?.trim();

    // กรณีพิมพ์ /login เปล่าๆ หรือไม่ครบ
    if (!rawArgs) {
      await bot.sendMessage(
        chatId,
        [
          `🔐 *วิธีล็อกอิน:*`,
          ``,
          `พิมพ์คำสั่งตามรูปแบบนี้:`,
          `\`/login อีเมล รหัสผ่าน\``,
          ``,
          `📌 *ตัวอย่าง:*`,
          `\`/login test@gmail.com 123456\``,
          ``,
          `🔒 _ข้อความจะถูกลบทันทีเพื่อความปลอดภัย_`,
        ].join("\n"),
        { parse_mode: "Markdown" },
      );
      return;
    }

    const args = rawArgs.split(" ").filter((a) => a.length > 0);

    if (args.length < 2) {
      await bot.sendMessage(
        chatId,
        [
          `❌ *รูปแบบไม่ถูกต้อง!*`,
          ``,
          `ต้องใส่ทั้ง *อีเมล* และ *รหัสผ่าน*`,
          `\`/login อีเมล รหัสผ่าน\``,
          ``,
          `📌 ตัวอย่าง: \`/login test@gmail.com 123456\``,
        ].join("\n"),
        { parse_mode: "Markdown" },
      );
      return;
    }

    // Validate email format
    const email = args[0] as string;
    const password = args[1] as string;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      await bot.sendMessage(
        chatId,
        [
          `❌ *อีเมลไม่ถูกรูปแบบ!*`,
          ``,
          `กรุณาใส่อีเมลที่ถูกต้อง เช่น:`,
          `\`/login test@gmail.com 123456\``,
        ].join("\n"),
        { parse_mode: "Markdown" },
      );
      return;
    }

    try {
      const user = await AuthService.login(email, password);
      loggedInUsers.set(chatId, user.id);

      await bot.sendMessage(
        chatId,
        [
          `✅ *ล็อกอินสำเร็จ!*`,
          `👤 ${user.username}`,
          ``,
          `📷 ส่งรูปสลิปมาได้เลยครับ!`,
        ].join("\n"),
        { parse_mode: "Markdown" },
      );
    } catch (error: any) {
      const errorMsg =
        error.message === "USER_NOT_FOUND"
          ? "❌ ไม่พบอีเมลนี้ในระบบ"
          : error.message === "INVALID_PASSWORD"
            ? "❌ รหัสผ่านไม่ถูกต้อง"
            : error.message === "USER_DISABLED"
              ? "❌ บัญชีนี้ถูกระงับการใช้งาน"
              : "❌ เกิดข้อผิดพลาดในการล็อกอิน";
      await bot.sendMessage(chatId, errorMsg);
    }
  });

  // ========================================
  // /logout
  // ========================================
  bot.onText(/\/logout/, async (msg) => {
    const chatId = msg.chat.id;
    loggedInUsers.delete(chatId);
    pendingSlips.delete(chatId);
    await bot.sendMessage(chatId, "👋 ออกจากระบบแล้ว ใช้ /login เพื่อเข้าใหม่");
  });

  // ========================================
  // /quota — เช็คจำนวนครั้งที่เหลือ
  // ========================================
  bot.onText(/\/quota/, async (msg) => {
    const chatId = msg.chat.id;
    const quotaText = await getSlipOkQuota();
    await bot.sendMessage(chatId, quotaText, { parse_mode: "Markdown" });
  });

  // ========================================
  // เมื่อผู้ใช้ส่งรูปภาพ (สลิป)
  // ========================================
  bot.on("photo", async (msg) => {
    const chatId = msg.chat.id;

    // เช็คว่า login แล้วหรือยัง
    const userId = loggedInUsers.get(chatId);
    if (!userId) {
      await bot.sendMessage(
        chatId,
        "🔐 กรุณาล็อกอินก่อน: `/login email password`",
        { parse_mode: "Markdown" },
      );
      return;
    }

    try {
      await bot.sendMessage(chatId, "⏳ กำลังอ่านข้อมูลจากสลิป...");

      // 1. ดาวน์โหลดรูป
      const photoArray = msg.photo;
      if (!photoArray || photoArray.length === 0) return;
      const lastPhoto = photoArray[
        photoArray.length - 1
      ] as TelegramBot.PhotoSize;
      const downloadedPath = await bot.downloadFile(
        lastPhoto.file_id,
        os.tmpdir(),
      );

      // 2. ส่งไป SlipOK อ่าน OCR
      const form = new FormData();
      form.append("files", fs.createReadStream(downloadedPath));

      const slipResponse = await axios.post(`${process.env.SLIPOK_API}`, form, {
        headers: {
          "x-authorization": `${process.env.SLIPOK_API_KEY}`,
          ...form.getHeaders(),
        },
      });

      fs.unlinkSync(downloadedPath);

      const slipData = slipResponse.data?.data;

      if (!slipData || !slipData.success) {
        await bot.sendMessage(
          chatId,
          "❌ ไม่สามารถอ่านข้อมูลจากสลิปได้ กรุณาลองส่งใหม่",
        );
        return;
      }

      // 3. ดึงข้อมูลจาก SlipOK
      const amount = slipData.amount;
      const sender = slipData.sender?.displayName || "ไม่ระบุ";
      const receiver = slipData.receiver?.displayName || "ไม่ระบุ";
      const transDate = slipData.transTimestamp
        ? new Date(slipData.transTimestamp).toISOString()
        : new Date().toISOString();
      const note = `โอนจาก ${sender} ไปยัง ${receiver}`;

      // เก็บข้อมูลชั่วคราว
      pendingSlips.set(chatId, {
        userId,
        amount,
        sender,
        receiver,
        transDate,
        note,
        step: "select_account",
      });

      // 4. แสดงข้อมูลสลิป + ปุ่มเลือกบัญชี
      const accounts = await AccountService.listAccounts(userId);
      const quotaText = await getSlipOkQuota();

      const accountButtons = accounts.map(
        (acc: { id: number; name: string }) => [
          { text: `🏦 ${acc.name}`, callback_data: `account_${acc.id}` },
        ],
      );

      const slipSummary = [
        `📋 *ข้อมูลจากสลิป:*`,
        `💰 จำนวน: *${amount.toLocaleString()} บาท*`,
        `📤 ผู้โอน: ${sender}`,
        `📥 ผู้รับ: ${receiver}`,
        `📅 วันที่: ${new Date(transDate).toLocaleDateString("th-TH")}`,
        `📝 หมายเหตุ: ${note}`,
        ``,
        quotaText,
        ``,
        `👇 *เลือกบัญชีที่ต้องการบันทึก:*`,
      ].join("\n");

      await bot.sendMessage(chatId, slipSummary, {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: accountButtons },
      });
    } catch (error: any) {
      console.error("Telegram Bot Error:", error?.response?.data || error);
      await bot.sendMessage(
        chatId,
        "❌ เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่",
      );
    }
  });

  // ========================================
  // เมื่อผู้ใช้กดปุ่ม Inline Keyboard
  // ========================================
  bot.on("callback_query", async (callbackQuery) => {
    const chatId = callbackQuery.message?.chat.id;
    const data = callbackQuery.data;
    if (!chatId || !data) return;

    await bot.answerCallbackQuery(callbackQuery.id);

    const pending = pendingSlips.get(chatId);
    if (!pending) {
      await bot.sendMessage(chatId, "⚠️ ไม่พบข้อมูลสลิป กรุณาส่งรูปใหม่");
      return;
    }

    try {
      // ===== เลือกบัญชี =====
      if (data.startsWith("account_") && pending.step === "select_account") {
        pending.accountId = Number(data.replace("account_", ""));
        pending.step = "select_category";
        pendingSlips.set(chatId, pending);

        const categories = await CategoryService.listCategories();
        const categoryButtons = categories.map(
          (cat: { id: number; name: string; type: string }) => [
            {
              text: `${cat.type === "income" ? "📈" : "📉"} ${cat.name}`,
              callback_data: `category_${cat.id}`,
            },
          ],
        );

        await bot.editMessageText(`✅ เลือกบัญชีแล้ว!\n\n👇 *เลือกหมวดหมู่:*`, {
          chat_id: chatId,
          message_id: callbackQuery.message?.message_id,
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: categoryButtons },
        });
      }

      // ===== เลือกหมวดหมู่ → ถามแก้ Note =====
      if (data.startsWith("category_") && pending.step === "select_category") {
        pending.categoryId = Number(data.replace("category_", ""));
        pending.step = "edit_note";
        pendingSlips.set(chatId, pending);

        // ถามว่าจะแก้ Note ไหม
        await bot.editMessageText(
          [
            `✅ เลือกหมวดหมู่แล้ว!`,
            ``,
            `📝 *หมายเหตุปัจจุบัน:*`,
            `"${pending.note}"`,
            ``,
            `ต้องการแก้ไขหมายเหตุไหม?`,
          ].join("\n"),
          {
            chat_id: chatId,
            message_id: callbackQuery.message?.message_id,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "✏️ แก้ไข Note", callback_data: "note_edit" },
                  {
                    text: "✅ ใช้ค่าเดิม บันทึกเลย",
                    callback_data: "note_keep",
                  },
                ],
              ],
            },
          },
        );
      }

      // ===== กดแก้ Note → รอรับข้อความจากผู้ใช้ =====
      if (data === "note_edit" && pending.step === "edit_note") {
        pending.step = "waiting_note";
        pendingSlips.set(chatId, pending);

        await bot.editMessageText("✏️ พิมพ์หมายเหตุใหม่ที่ต้องการได้เลยครับ:", {
          chat_id: chatId,
          message_id: callbackQuery.message?.message_id,
        });
      }

      // ===== ใช้ Note เดิม → บันทึกเลย =====
      if (data === "note_keep" && pending.step === "edit_note") {
        await saveTransaction(
          bot,
          chatId,
          pending,
          callbackQuery.message?.message_id,
        );
      }
    } catch (error: any) {
      console.error("Callback Error:", error?.response?.data || error);
      await bot.sendMessage(chatId, "❌ เกิดข้อผิดพลาด กรุณาส่งรูปใหม่");
      pendingSlips.delete(chatId);
    }
  });

  // ========================================
  // รับข้อความทั่วไป (รวมถึง Note ที่ผู้ใช้พิมพ์)
  // ========================================
  bot.on("message", async (msg) => {
    if (msg.photo) return;
    if (msg.text?.startsWith("/")) return;

    const chatId = msg.chat.id;
    const text = msg.text || "";
    const pending = pendingSlips.get(chatId);

    // ถ้ากำลังรอ Note ใหม่จากผู้ใช้
    if (pending && pending.step === "waiting_note" && text) {
      pending.note = text;
      await saveTransaction(bot, chatId, pending);
      return;
    }

    // ตรวจจับข้อความที่อาจเป็น credentials (มี @ อยู่ = อาจเป็น email)
    // ลบทิ้งทันทีเพื่อความปลอดภัย
    if (text.includes("@")) {
      try {
        await bot.deleteMessage(chatId, msg.message_id);
      } catch {
        // อาจไม่มีสิทธิ์ลบ
      }

      await bot.sendMessage(
        chatId,
        [
          `⚠️ *ข้อความถูกลบเพื่อความปลอดภัย!*`,
          ``,
          `หากต้องการล็อกอิน กรุณาพิมพ์ให้มี \`/login\` นำหน้า:`,
          `\`/login อีเมล รหัสผ่าน\``,
          ``,
          `📌 ตัวอย่าง: \`/login test@gmail.com 123456\``,
        ].join("\n"),
        { parse_mode: "Markdown" },
      );
      return;
    }

    // ข้อความทั่วไป
    if (!loggedInUsers.has(chatId)) {
      await bot.sendMessage(
        chatId,
        [
          `🔐 *กรุณาล็อกอินก่อนใช้งาน*`,
          ``,
          `พิมพ์: \`/login อีเมล รหัสผ่าน\``,
        ].join("\n"),
        { parse_mode: "Markdown" },
      );
    } else {
      await bot.sendMessage(
        chatId,
        "📷 กรุณาส่ง *รูปสลิปการโอนเงิน* มาให้ Bot นะครับ",
        { parse_mode: "Markdown" },
      );
    }
  });

  // ========================================
  // ฟังก์ชัน บันทึก Transaction ลง DB
  // ========================================
  async function saveTransaction(
    bot: TelegramBot,
    chatId: number,
    pending: PendingSlip,
    messageId?: number,
  ) {
    try {
      // แจ้งสถานะ
      if (messageId) {
        await bot.editMessageText("⏳ กำลังบันทึกรายการ...", {
          chat_id: chatId,
          message_id: messageId,
        });
      } else {
        await bot.sendMessage(chatId, "⏳ กำลังบันทึกรายการ...");
      }

      // บันทึกลง DB
      await TransactionService.createTransactions(
        pending.userId,
        pending.amount,
        pending.note,
        pending.accountId!,
        pending.categoryId!,
        pending.transDate,
      );

      // ล้าง Cache
      await Promise.all([
        redisClient.del(`summary:${pending.userId}`),
        redisClient.del(`analytics:${pending.userId}`),
        redisClient.del(`list:${pending.userId}`),
      ]);

      // ส่งข้อความยืนยัน
      const confirmMessage = [
        `✅ *บันทึกรายการสำเร็จ!*`,
        ``,
        `💰 จำนวน: *${pending.amount.toLocaleString()} บาท*`,
        `📤 ผู้โอน: ${pending.sender}`,
        `📥 ผู้รับ: ${pending.receiver}`,
        `📅 วันที่: ${new Date(pending.transDate).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        `📝 หมายเหตุ: ${pending.note}`,
      ].join("\n");

      await bot.sendMessage(chatId, confirmMessage, {
        parse_mode: "Markdown",
      });

      pendingSlips.delete(chatId);
    } catch (error: any) {
      console.error("Save Error:", error);
      await bot.sendMessage(
        chatId,
        "❌ เกิดข้อผิดพลาดในการบันทึก กรุณาส่งรูปใหม่",
      );
      pendingSlips.delete(chatId);
    }
  }
};
