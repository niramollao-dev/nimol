
# AI Shortcourse (Option A — Embed-able Starter)

> วันที่สร้าง: 2025-09-16 16:03:48

คอร์สระยะสั้นสอนการใช้ AI พร้อม **mini-เกม** และระบบ **เหรียญ** แลก **รางวัล** ใช้กับ Supabase (Postgres + RLS + RPC)

## ติดตั้งอย่างย่อ
1. เปิด Supabase SQL Editor แล้วรัน:
   - `sql/ai_course_init.sql`
   - `sql/ai_course_sample.sql`
2. ตั้ง **admin** ให้ผู้ใช้ (แทน UUID จริง):
   ```sql
   update public.profiles set role='admin' where user_id='YOUR-AUTH-USER-ID';
   ```
3. เปิด `web/settings.js` แล้วใส่ค่า `SUPABASE_URL`, `SUPABASE_ANON_KEY`

## โครงสร้าง
- `sql/` สคีมาฐานข้อมูล + RPC + seed
- `web/` SPA แบบไฟล์เดียว + JS modules (ไม่ต้อง build)

## รันแบบ Static
- เปิด `web/index.html` ในโฮสต์ static (GitHub Pages, Netlify, Vercel, หรือ nginx)
- ใช้ Supabase Auth (Email OTP/Magic Link) หรือใส่ `supabase.auth.signUp/signInWithPassword` เอง

## Routes
- `#ai-home` : บทเรียน + ยอดเหรียญ
- `#ai-lesson?id=...` : เนื้อหา + resource
- `#ai-play?lesson=...` : ทำแบบฝึก/mini-เกม
- `#rewards` : ร้านค้าแลก
- `#ai-admin` : Admin จัดการคำขอแลก

> สามารถคัดลอก `web/modules/*` ไปรวมในโปรเจกต์เดิม (APPWD) แล้วเพิ่ม route ใน `app.js` ได้เลย
