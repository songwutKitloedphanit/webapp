# EX12: Menu + Register/Login (JWT)

ทำตาม Todo ท้ายสไลด์ `ch8 ReactJs Authen.pptx.pdf` โดยเริ่มจากโค้ด EX11 (โฟลเดอร์ `backend` และ `frontend` เป็นสำเนา ไม่ได้แก้ไฟล์ใน EX11)

| โหมด | ทำอะไรได้ |
| --- | --- |
| Guest | ดูเมนูพร้อมคะแนนเฉลี่ย ⭐ (อัปเดตเองทุก 5 วินาที), ปุ่ม Login |
| User | ทุกอย่างของ Guest + เลือกคะแนน 1-5 ให้แต่ละเมนู, Logout |
| Admin | เพิ่ม แก้ไข ลบเมนู, หน้า `/users` เปลี่ยน role ของผู้ใช้, Logout |

หน้า: `/` (Home), `/login`, `/register`, `/users` (admin เท่านั้น)

## Database

Supabase ที่ EX10/EX11 ใช้ตอบกลับ `tenant/user ... not found` (โปรเจกต์ถูก pause หรือลบ) ตอนนี้จึงใช้ PostgreSQL ใน Docker container ชื่อ `ex12-postgres` (port `5440`) ซึ่งสร้างตารางและใส่เมนูตัวอย่างไว้แล้ว `backend/.env` ชี้ไปที่ container นี้

```powershell
docker start ex12-postgres
```

ถ้าจะสร้างใหม่ที่อื่น ให้รัน `backend/import.sql` แล้วตามด้วย `backend/seed.sql`

บัญชีทดสอบที่สร้างไว้ระหว่างตรวจงานใน container นี้ (รหัสผ่าน `password123` ทุกบัญชี): `john` (admin), `ann` (user), `cate` (user)

## Start

1. Backend: เปิด PowerShell ที่ `ex12\backend` แล้วรัน `npm install` และ `npm run dev:server`
2. Frontend: เปิด PowerShell อีกหน้าต่างที่ `ex12\frontend` แล้วรัน `npm install` และ `npm run dev`

Vite ส่งต่อ `/api` ไปที่ `API_TARGET` (ค่าเริ่มต้น `http://localhost:3000`) บนเครื่องนี้ port `3000` ถูก container `mordin-backend` ใช้อยู่ จึงตั้ง backend เป็น `PORT=3001` และมี `frontend/.env.local` ที่ตั้ง `API_TARGET=http://localhost:3001` ไว้แล้ว

## Tests

- `ex12\backend`: `npm test`
- `ex12\frontend`: `npm test` และ `npm run lint`
