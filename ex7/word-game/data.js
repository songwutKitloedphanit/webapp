"use strict";

const wordKey = "ex7.words";
const defaultWords = ["CAT", "DOG", "SUN", "CAR", "HAT", "PEN", "CUP", "BOX"];

function loadWords() {
    try {
        const raw = localStorage.getItem(wordKey);
        const words = raw === null ? [...defaultWords] : JSON.parse(raw);
        if (
            !Array.isArray(words) ||
            !words.every((word) => typeof word === "string" && /^[A-Z]{3}$/.test(word)) ||
            new Set(words).size !== words.length
        ) {
            throw new Error("รายการคำศัพท์ที่บันทึกไว้ไม่ถูกต้อง");
        }
        return words;
    } catch (error) {
        throw new Error("อ่านคำศัพท์ไม่ได้: " + error.message);
    }
}

function saveWords(words) {
    try {
        localStorage.setItem(wordKey, JSON.stringify(words));
    } catch (error) {
        throw new Error("บันทึกคำศัพท์ไม่ได้: " + error.message);
    }
}

function showMessage(text, isError = false) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.classList.toggle("error", isError);
}

function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
