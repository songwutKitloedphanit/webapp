const express = require("express");
const path = require("path");

const app = express();
const port = Number(process.env.PORT || 8080);

app.use(express.static(path.join(__dirname, "public")));

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/menu", (req, res) => {
    res.sendFile(path.join(__dirname, "info", "menu.html"));
});

app.get("/order", (req, res) => {
    res.sendFile(path.join(__dirname, "info", "order.html"));
});

app.get("/item/:name/price/:price", (req, res) => {
    // Route parameters are displayed as text, never as HTML.
    const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
    const name = escapeHtml(req.params.name);
    const price = escapeHtml(req.params.price);

    res.send(`<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | คาเฟ่เบเกอรี่</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <h1>คาเฟ่เบเกอรี่</h1>
        <nav aria-label="เมนูหลัก">
            <ul>
                <li><a href="/home">หน้าแรก</a></li>
                <li><a href="/menu">เมนูขนม</a></li>
                <li><a href="/order">สั่งขนม</a></li>
            </ul>
        </nav>
    </header>
    <main class="item-card">
        <p class="item-eyebrow">WARM BAKERY CAFE</p>
        <h2>ข้อมูลเมนู</h2>
        <p class="item-name">ชื่อเมนู: ${name}</p>
        <p class="item-price">ราคา: ${price} บาท</p>
        <a class="item-back" href="/menu">กลับไปเลือกเมนู</a>
    </main>
</body>
</html>`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
