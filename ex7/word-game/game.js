"use strict";

const ROUND_SECONDS = 20;
const ROUND_COUNT = 5;
let selectedWords = [];
let round = 0;
let score = 0;
let active = false;
let timer;
let deadline = 0;
let characters = [];
let answer = [null, null, null];
const slots = document.getElementById("slots");
const letters = document.getElementById("letters");
const next = document.getElementById("next");

function dragstartHandler(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dragoverHandler(event) {
    event.preventDefault();
}

function dropHandler(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    if (!/^letter-[0-2]$/.test(id)) return;
    const element = document.getElementById(id);
    if (!element || element.parentNode !== letters) return;
    placeLetter(Number(element.dataset.index), Number(event.currentTarget.dataset.slot));
}

function renderLetters() {
    slots.textContent = "";
    letters.textContent = "";
    answer.forEach((characterIndex, slotIndex) => {
        const slot = document.createElement("div");
        slot.className = "slot";
        slot.dataset.slot = slotIndex;
        slot.setAttribute("aria-label", "ช่อง " + (slotIndex + 1));
        slot.addEventListener("dragover", dragoverHandler);
        slot.addEventListener("drop", dropHandler);
        slots.appendChild(slot);
    });
    characters.forEach((character, index) => {
        const button = document.createElement("button");
        button.id = "letter-" + index;
        button.className = "letter";
        button.textContent = character;
        button.dataset.index = index;
        button.disabled = !active;
        button.draggable = active && !answer.includes(index);
        button.addEventListener("dragstart", dragstartHandler);
        button.addEventListener("click", () => {
            if (!checkTime()) return;
            const slotIndex = answer.indexOf(index);
            if (slotIndex !== -1) {
                answer[slotIndex] = null;
                letters.appendChild(button);
                button.draggable = true;
            } else {
                placeLetter(index, answer.indexOf(null));
            }
        });
        const slotIndex = answer.indexOf(index);
        const parent = slotIndex === -1 ? letters : slots.children[slotIndex];
        parent.appendChild(button);
    });
}

function checkTime() {
    if (!active) return false;
    if (Date.now() >= deadline) {
        document.getElementById("time").textContent = "เวลา 0 วินาที";
        finishRound(false, true);
        return false;
    }
    return true;
}

function placeLetter(characterIndex, slotIndex) {
    if (
        !checkTime() ||
        !Number.isInteger(characterIndex) ||
        characterIndex < 0 ||
        characterIndex >= characters.length ||
        slotIndex < 0 ||
        slotIndex > 2 ||
        answer[slotIndex] !== null ||
        answer.includes(characterIndex)
    )
        return;
    answer[slotIndex] = characterIndex;
    const element = document.getElementById("letter-" + characterIndex);
    slots.children[slotIndex].appendChild(element);
    element.draggable = false;
    if (answer.every((index) => index !== null)) {
        finishRound(answer.map((index) => characters[index]).join("") === selectedWords[round]);
    }
}

function finishRound(correct, timedOut = false) {
    if (!active) return;
    active = false;
    clearInterval(timer);
    if (correct) score++;
    document.getElementById("score").textContent = "คะแนน " + score;
    const result = timedOut ? "หมดเวลา" : correct ? "ถูกต้อง!" : "ยังไม่ถูก";
    showMessage(
        result +
            " คำตอบคือ " +
            selectedWords[round] +
            (round === ROUND_COUNT - 1 ? " — จบเกม ได้ " + score + " / 5 คะแนน" : "")
    );
    next.hidden = round === ROUND_COUNT - 1;
    renderLetters();
}

function startRound() {
    clearInterval(timer);
    answer = [null, null, null];
    characters = shuffle([...selectedWords[round]]);
    if (characters.join("") === selectedWords[round]) {
        const different = characters.findIndex((character) => character !== characters[0]);
        if (different > 0)
            [characters[0], characters[different]] = [characters[different], characters[0]];
    }
    active = true;
    deadline = Date.now() + ROUND_SECONDS * 1000;
    next.hidden = true;
    document.getElementById("round").textContent = "รอบ " + (round + 1) + " / 5";
    document.getElementById("time").textContent = "เวลา 20 วินาที";
    showMessage("เรียงตัวอักษรให้เป็นคำศัพท์");
    renderLetters();
    timer = setInterval(() => {
        if (!checkTime()) return;
        document.getElementById("time").textContent =
            "เวลา " + Math.ceil((deadline - Date.now()) / 1000) + " วินาที";
    }, 200);
}

document.getElementById("start").addEventListener("click", () => {
    clearInterval(timer);
    active = false;
    next.hidden = true;
    try {
        const words = loadWords();
        if (words.length < ROUND_COUNT)
            throw new Error("ต้องมีคำศัพท์อย่างน้อย 5 คำ กรุณาเพิ่มในหน้าจัดการคำศัพท์");
        selectedWords = shuffle(words).slice(0, ROUND_COUNT);
        round = 0;
        score = 0;
        document.getElementById("score").textContent = "คะแนน 0";
        startRound();
    } catch (error) {
        renderLetters();
        showMessage(error.message, true);
    }
});
next.addEventListener("click", () => {
    if (active || round >= ROUND_COUNT - 1) return;
    round++;
    startRound();
});

window.addEventListener("pagehide", () => {
    clearInterval(timer);
    active = false;
});

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        next.hidden = true;
        renderLetters();
        showMessage("กด Reset เพื่อเริ่มเกมใหม่");
    }
});

renderLetters();
