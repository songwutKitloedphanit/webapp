# Menu and Authen API

Express API สำหรับเมนู, ประเภทเมนู, สมัครสมาชิก/login ด้วย JWT, ให้คะแนนเมนู และเปลี่ยน role ของผู้ใช้ ใช้ PostgreSQL ผ่าน `pg`

## เริ่มใช้งาน

1. คัดลอก `.env.example` เป็น `.env` แล้วตั้งค่า
   - `DATABASE_URL` ชี้ไปที่ PostgreSQL
   - `JWT_KEY` เป็นข้อความสุ่มยาว ๆ สร้างได้ด้วย `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
   - `PORT` ค่าเริ่มต้น `3000`
2. รัน `import.sql` เพื่อสร้างตาราง `type`, `menu`, `users`, `rating` (ใช้ `CREATE TABLE IF NOT EXISTS` จึงรันซ้ำกับฐานข้อมูลเดิมได้) และรัน `seed.sql` ถ้าต้องการเมนูตัวอย่าง
3. `npm install` แล้ว `npm run dev:server`

ผู้สมัครใหม่ได้ role `user` เสมอ ให้ตั้ง admin คนแรกใน database:

```sql
UPDATE public.users SET role = 'admin' WHERE "userName" = 'ชื่อผู้ใช้';
```

## API

| Method | Path | สิทธิ์ | การทำงาน |
| --- | --- | --- | --- |
| `POST` | `/api/authen/register` | ทุกคน | สมัครสมาชิก `201`, ซ้ำ `409` |
| `POST` | `/api/authen/login` | ทุกคน | login ได้ `200` + `token`, ไม่พบ user หรือรหัสผิด `404` |
| `GET` | `/api/authen/home` | login แล้ว | ข้อมูลผู้ใช้จาก token |
| `GET` | `/api/menu` | ทุกคน | เมนูพร้อม `avgRating`, `ratingCount` |
| `POST`, `PATCH`, `DELETE` | `/api/menu`, `/api/menu/:menuId` | admin | เพิ่ม แก้ไข ลบเมนู |
| `GET` | `/api/type` | ทุกคน | ประเภทเมนู |
| `POST`, `PATCH`, `DELETE` | `/api/type`, `/api/type/:typeId` | admin | จัดการประเภทเมนู |
| `GET` | `/api/rating/me` | login แล้ว | คะแนนที่ตัวเองให้ไว้ |
| `PUT` | `/api/rating/:menuId` | login แล้ว | ให้หรือแก้คะแนน `{ "score": 1-5 }` |
| `GET` | `/api/users` | admin | รายชื่อผู้ใช้ |
| `PATCH` | `/api/users/:userId/role` | admin | เปลี่ยน role `{ "role": "user" \| "admin" }` (เปลี่ยนของตัวเองไม่ได้) |

ส่ง token ใน header `Authorization: Bearer <token>` token หมดอายุใน 1 ชั่วโมง ถ้าไม่มี token หรือ token ใช้ไม่ได้จะได้ `401` ถ้าไม่ใช่ admin จะได้ `403` และ role อ่านจาก database ทุก request ดังนั้นเมื่อ admin เปลี่ยน role จะมีผลทันที

## Tests

`npm test`
