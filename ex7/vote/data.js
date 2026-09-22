"use strict";

const voteKey = "ex7.votes";

function loadVotes() {
    try {
        const raw = localStorage.getItem(voteKey);
        const votes = raw === null ? [0, 0, 0] : JSON.parse(raw);
        if (
            !Array.isArray(votes) ||
            votes.length !== 3 ||
            !votes.every((value) => Number.isSafeInteger(value) && value >= 0)
        ) {
            throw new Error("รูปแบบคะแนนที่บันทึกไว้ไม่ถูกต้อง");
        }
        return votes;
    } catch (error) {
        throw new Error("อ่านคะแนนไม่ได้: " + error.message);
    }
}

function saveVotes(votes) {
    try {
        localStorage.setItem(voteKey, JSON.stringify(votes));
    } catch (error) {
        throw new Error("บันทึกคะแนนไม่ได้: " + error.message);
    }
}

function showMessage(text, isError = false) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.classList.toggle("error", isError);
}
