"use strict";

const pictures = [
    "apple",
    "grapes",
    "pineapple",
    "apple",
    "grapes",
    "pineapple",
    "apple",
    "grapes"
];
const pictureNames = { apple: "แอปเปิล", grapes: "องุ่น", pineapple: "สับปะรด" };
const board = document.getElementById("board");
let deck = [];
let opened = [];
let matched = new Set();
let pairs = 0;
let moves = 0;
let locked = false;
let hideTimer;

function renderBoard() {
    board.textContent = "";
    deck.forEach((picture, index) => {
        const button = document.createElement("button");
        const visible = opened.includes(index) || matched.has(index);
        button.className = "tile" + (matched.has(index) ? " matched" : "");
        if (visible) {
            const image = document.createElement("img");
            image.src = "images/" + picture + ".png";
            image.alt = pictureNames[picture];
            button.appendChild(image);
        } else {
            button.textContent = "?";
        }
        button.setAttribute(
            "aria-label",
            "ใบที่ " + (index + 1) + (visible ? " " + pictureNames[picture] : " ปิดอยู่")
        );
        button.disabled = locked || visible;
        button.addEventListener("click", () => openCard(index));
        board.appendChild(button);
    });
    document.getElementById("pairs").textContent = "จับคู่ " + pairs + " / " + pictures.length;
    document.getElementById("moves").textContent = "เปิดคู่ " + moves + " ครั้ง";
}

function openCard(index) {
    if (locked || matched.has(index) || opened.includes(index)) return;
    opened.push(index);
    if (opened.length === 2) {
        moves++;
        if (deck[opened[0]] === deck[opened[1]]) {
            opened.forEach((value) => matched.add(value));
            opened = [];
            pairs++;
            document.getElementById("message").textContent =
                pairs === pictures.length
                    ? "ครบทุกคู่แล้ว! ใช้ " + moves + " ครั้ง"
                    : "จับคู่ถูกต้อง!";
        } else {
            locked = true;
            document.getElementById("message").textContent = "ไม่ตรงกัน รอ 2 วินาที";
            hideTimer = setTimeout(() => {
                opened = [];
                locked = false;
                document.getElementById("message").textContent = "ลองเปิดคู่ใหม่";
                renderBoard();
            }, 2000);
        }
    }
    renderBoard();
}

function resetGame() {
    clearTimeout(hideTimer);
    deck = [...pictures, ...pictures];
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    opened = [];
    matched = new Set();
    pairs = 0;
    moves = 0;
    locked = false;
    document.getElementById("message").textContent = "เลือกเปิดภาพ 2 ใบ";
    renderBoard();
}

document.getElementById("reset").addEventListener("click", resetGame);
resetGame();
