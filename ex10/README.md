# Menu and Type API

Express API สำหรับจัดการเมนูและประเภทอาหาร ใช้ PostgreSQL โดยแยก `controllers`, `routes` และ `db` ไว้ใน `src` ตามหน้าที่ ใช้ Supabase PostgreSQL schema `public` กับตาราง `menu` และ `type`

## เริ่มใช้งาน

1. ถ้ายังไม่มีตาราง `menu` และ `type` ให้นำ `import.sql` ไปรันใน Supabase SQL Editor
2. คัดลอก `.env.example` เป็น `.env` แล้วแทน `YOUR_PASSWORD` ใน `DATABASE_URL` ด้วยรหัสผ่านฐานข้อมูล Supabase หากรหัสผ่านมีอักขระพิเศษ ให้ URL-encode ก่อน
3. ติดตั้ง packages ด้วย `npm install`
4. เริ่ม API ด้วย `npm run dev:server`; API ใช้ port `3000` โดยค่าเริ่มต้น

ถ้า API แจ้ง `SELF_SIGNED_CERT_IN_CHAIN` ให้ดาวน์โหลด root certificate จาก Supabase Dashboard ใน `Database Settings` → `SSL Configuration` แล้วบันทึกเป็น `.supabase/prod-ca-2021.crt` จากนั้นตั้ง `DATABASE_SSL_CA_PATH=.supabase/prod-ca-2021.crt` ใน `.env` โฟลเดอร์ `.supabase` ถูก ignore ใน Git

Connection string ที่ให้มาใช้ shared pooler แบบ session mode บน port `5432`; ตั้ง `sslmode=require` เพื่อบังคับใช้การเชื่อมต่อแบบเข้ารหัส

## API

| Method | Path | การทำงาน |
| --- | --- | --- |
| `GET`, `POST` | `/api/menu` | ดูและเพิ่มเมนู |
| `PATCH`, `DELETE` | `/api/menu/:menuId` | แก้ไขและลบเมนู |
| `GET`, `POST` | `/api/type` | ดูและเพิ่มประเภทเมนู |
| `PATCH`, `DELETE` | `/api/type/:typeId` | แก้ไขและลบประเภทเมนู |

ข้อมูลเมนูใช้ `menuId`, `name`, `price`, `isBestSeller` และ `typeId` ตามตาราง `menu`; ข้อมูลประเภทใช้ `typeId` และ `name` ตามตาราง `type`
