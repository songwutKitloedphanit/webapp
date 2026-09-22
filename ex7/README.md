# EX7

แบบฝึกหัด HTML, CSS และ JavaScript ตาม index.pdf หน้า 26–28

## เปิดใช้งาน

เปิด PowerShell ในโฟลเดอร์นี้แล้วรัน:

```powershell
python -m http.server 8077 --bind 127.0.0.1
```

เปิด http://127.0.0.1:8077/ ใน browser ใช้ Ctrl+C เพื่อหยุด server
ใช้ URL เดิมทุกครั้งเพื่อเข้าถึง localStorage ชุดเดิม

## งานทั้ง 3

- vote/vote.htm: คลิกรูปเบอร์เกอร์ พิซซ่า หรือฮอตดอกเพื่อโหวต ไปหน้า Showvote.htm เพื่อดูผล กลับมาโหวตต่อได้ และล้างคะแนนได้
- word-game/index.html: เริ่มเกม ลากหรือคลิกตัวอักษรเพื่อเรียงคำ คลิกตัวอักษรที่วางแล้วเพื่อนำกลับ ตรวจทันทีเมื่อครบ 3 ตัว เล่น 5 คำ คำละ 20 วินาที ตอบถูกได้ 1 คะแนน กดคำถัดไปหลังจบรอบ หรือ Reset เพื่อเริ่มใหม่
- word-game/words.html: พิมพ์คำอังกฤษ 3 ตัวอักษรแล้วกด Enter เพื่อเพิ่ม กดถังขยะสีแดงเพื่อลบ ต้องมีอย่างน้อย 5 คำเพื่อเริ่มเกม มีคำเริ่มต้นให้ 8 คำ
- matching-game/index.html: เปิดภาพ 8 คู่ในตาราง 4 × 4 คู่ผิดปิดหลัง 2 วินาที คู่ถูกเปิดค้าง Reset ยกเลิกการรอและเริ่มใหม่

คะแนนโหวตและรายการคำศัพท์เก็บใน localStorage ของ browser ไม่ใช่ฐานข้อมูลร่วมระหว่างผู้ใช้ รูปอาหารและผลไม้ดึงจากภาพที่ฝังอยู่ใน index.pdf

## โครงสร้าง

HTML จัดโครงหน้า, style.css จัดรูปแบบ, JavaScript จัดการเหตุการณ์และสถานะ
vote/data.js และ word-game/data.js จัดการข้อมูลที่แต่ละงานใช้ร่วมกัน
word-game/game.js กำหนดเวลาผ่าน ROUND_SECONDS และจำนวนรอบผ่าน ROUND_COUNT

## การตรวจสอบ

มี browser regression tests ใน tests/browser-tests.cjs ใช้ Playwright และ Microsoft Edge แบบ headless พร้อม browser context ใหม่แยกจากข้อมูลส่วนตัว

เมื่อมี Playwright อยู่แล้ว ให้ระบุ path ของ module ที่ติดตั้งไว้ จากนั้นรันขณะ server เปิดอยู่:

```powershell
$env:PLAYWRIGHT_MODULE = 'C:\path\to\node_modules\playwright'
node tests\browser-tests.cjs
```

ไม่จำเป็นต้องใช้ Playwright เพื่อเปิดเล่นงาน และไม่ได้เพิ่ม dependency ของโปรเจกต์
Tests ตรวจการโหวตและเก็บข้อมูล, ข้อมูลผิดรูปแบบ, เพิ่มลบคำศัพท์, drag-and-drop, ตัวอักษรซ้ำ, คะแนนครบ 5 รอบ, timeout, Reset, การจับคู่, หน้าจอมือถือ และ browser errors

## อ้างอิงโค้ดและ UI

| ส่วนงาน | แหล่งอ้างอิง | วิธีที่ใช้ |
| --- | --- | --- |
| UI โหวตและผลโหวต | index.pdf หน้า 26 | กรอบสีฟ้า รูปอาหารจริงจากสไลด์ และปุ่ม Show Vote / Back to Vote / Clear Vote |
| เก็บคะแนนและรายการคำศัพท์ | index.pdf หน้า 20–23 | localStorage.setItem/getItem และ JSON.stringify/parse |
| หน้าเพิ่มลบคำศัพท์ | index.pdf หน้า 27; ../ex6/index.pdf หน้า 30–33, 40; ../ex6/todo-list/index.html; ../ex5/script.js ข้อ 4–5 | รับ submit, createElement, appendChild และ event ลบรายการ พร้อมพื้นเขียว รายการเหลือง และถังขยะแดง |
| ลากตัวอักษร | index.pdf หน้า 18–19, 27 | draggable, dragstartHandler, setData("text", id), dragoverHandler, preventDefault, dropHandler, getData และ appendChild ย้ายตัวอักษรจริง |
| จับเวลาเกมเรียงคำ | index.pdf หน้า 13–14, 27 | setInterval และ clearInterval; ใช้ Date.now เพื่อเช็กเวลาสิ้นสุด |
| เปิดภาพจับคู่ | index.pdf หน้า 8–10, 28 | setTimeout 2000 ms และ clearTimeout เมื่อ Reset; กระดานเขียว 4 × 4 พื้นเหลืองอ่อน |
| Event และการเปลี่ยน DOM | ../ex6/index.pdf หน้า 5, 9–12; ../ex6/counter/index.html | getElementById, addEventListener และปรับข้อความตามสถานะ |

สไลด์ให้ตัวอย่าง API และโจทย์ ไม่ได้ให้โค้ดเกมสำเร็จรูปทั้งหมด โค้ดสุ่มคำ สรุปคะแนน ตรวจข้อมูล และจัดการสถานะจึงเขียนเพิ่มเพื่อเชื่อมตัวอย่างให้เป็นงานที่ใช้งานได้

รายละเอียดที่โจทย์ไม่ได้กำหนดแน่นอน:

- เวลา 20 วินาทีต่อคำเป็นค่าที่เลือกให้ เปลี่ยนได้ที่ ROUND_SECONDS
- ภาพจับคู่แสดง 16 ใบและมีผลไม้ชนิดเดิมซ้ำมากกว่าสองใบ แต่ภาพที่ปิดอยู่ไม่ระบุชนิด จึงใช้ผลไม้ 3 ชนิดที่มองเห็นจริงในสไลด์ซ้ำให้ครบ 8 คู่ ภาพชนิดเดียวกันจับคู่กันได้
- เพิ่มการคลิกตัวอักษรสำหรับมือถือและ keyboard ควบคู่กับ drag-and-drop
- หน้าเว็บคงลิงก์นำทางและข้อความสถานะไว้ เพื่อให้เปิดใช้งานแต่ละงานได้สะดวก

รูปต้นฉบับอยู่ใน vote/images และ matching-game/images ใช้ประกอบแบบฝึกหัดจากสไลด์ที่ให้มา

ผลตรวจล่าสุด: Syntax checks ผ่าน และ browser tests 41 รายการผ่าน รวมลิงก์หน้ารวม การโหลดรูปต้นฉบับ และความกว้างหน้าจอมือถือ

## รูปแบบหน้ารวมและโค้ด

หน้ารวมอ้างอิง ../ex6/index.html: พื้นไล่สีเขียว การ์ดเลขข้อ คำอธิบาย และลิงก์ Open app สำหรับทั้ง 3 งาน ส่วนหน้าแต่ละงานคง UI ตามสไลด์ ex7

จัด HTML, CSS และ JavaScript ให้เยื้อง 4 spaces ใช้ double quotes และ semicolons ใน JavaScript แยก CSS เป็นบล็อกหลายบรรทัด และเว้นระหว่างฟังก์ชันเพื่อให้อ่านตามงานเดิมได้ง่าย ใช้ไฟล์ HTML, CSS และ JavaScript แยกตามหน้าที่เหมือนโครงสร้าง ex7 ที่มีอยู่

ตรวจรูปแบบด้วย Prettier ที่มีในเครื่อง โดยไม่เพิ่ม dependency และผ่าน syntax checks กับ browser regression tests แล้ว
