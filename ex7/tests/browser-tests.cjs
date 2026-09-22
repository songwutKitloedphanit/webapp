const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
(async () => {
    const browser = await chromium.launch({ channel: "msedge", headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const base = process.env.EX7_URL || "http://127.0.0.1:8077";
    const go = (path) => page.goto(base + path);
    const check = (value, message) => {
        assert.ok(value, message);
        console.log("Passed: " + message);
    };
    try {
        await go("/");
        check((await page.locator(".exercise-card").count()) === 3, "index lists three exercises");
        for (const [index, path] of [
            "/vote/vote.htm",
            "/word-game/index.html",
            "/matching-game/index.html"
        ].entries()) {
            await page.locator(".exercise-card").nth(index).click();
            check(new URL(page.url()).pathname === path, "index card opens " + path);
            await page.locator('.page-nav a[href="../index.html"]').click();
        }
        await go("/vote/vote.htm");
        await page.locator('[data-vote="0"]').click();
        await page.locator('[data-vote="0"]').click();
        await page.locator('[data-vote="2"]').click();
        await page.locator('a[href="Showvote.htm"]').click();
        check(
            (await page.locator("#score-0").textContent()) === "2",
            "vote navigation preserves score"
        );
        await page.reload();
        check(
            (await page.locator("#score-2").textContent()) === "1",
            "vote reload preserves score"
        );
        await page.locator('a[href="vote.htm"]').click();
        await page.locator('[data-vote="1"]').click();
        await go("/vote/Showvote.htm");
        check(
            (await page.locator("#score-1").textContent()) === "1",
            "return to vote and increment"
        );
        await page.locator("#clear").click();
        check(
            (await page.locator(".score").allTextContents()).every((x) => x === "0"),
            "clear all votes"
        );
        await page.evaluate(() => localStorage.setItem("ex7.votes", "{broken"));
        await page.reload();
        check(
            await page.locator("#message").evaluate((el) => el.classList.contains("error")),
            "invalid stored votes show error"
        );
        await page.locator("#clear").click();

        await go("/word-game/words.html");
        await page.locator("#word").fill("egg");
        await page.locator("#word").press("Enter");
        check(
            (await page.locator("#word-list").textContent()).includes("EGG"),
            "add word and normalize case"
        );
        await page.reload();
        check(
            (await page.locator("#word-list").textContent()).includes("EGG"),
            "word persists on reload"
        );
        await page.locator("#word").fill("EGG");
        await page.locator("#word").press("Enter");
        check(
            await page.locator("#message").evaluate((el) => el.classList.contains("error")),
            "duplicate word rejected"
        );
        await page.getByRole("button", { name: "ลบ EGG", exact: true }).click();
        check(!(await page.locator("#word-list").textContent()).includes("EGG"), "delete word");
        await page.evaluate(() => {
            document.getElementById("word").value = "<x>";
            document
                .getElementById("word-form")
                .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        });
        check(
            await page.locator("#message").evaluate((el) => el.classList.contains("error")),
            "invalid word rejected at handler boundary"
        );
        await page.evaluate(() => localStorage.setItem("ex7.words", JSON.stringify(["CAT"])));
        await go("/word-game/index.html");
        await page.locator("#start").click();
        check(
            (await page.locator("#message").textContent()).includes("อย่างน้อย 5"),
            "insufficient words prevent start"
        );
        await page.evaluate(() =>
            localStorage.setItem("ex7.words", JSON.stringify(["EGG", "CAT", "DOG", "SUN", "CAR"]))
        );
        await page.clock.install();
        await page.locator("#start").click();
        for (let roundIndex = 0; roundIndex < 5; roundIndex++) {
            const target = await page.evaluate(() => selectedWords[round]);
            for (let i = 0; i < 3; i++) {
                const index = await page.evaluate(
                    (letter) => characters.findIndex((c, j) => c === letter && !answer.includes(j)),
                    target[i]
                );
                if (roundIndex === 0) {
                    await page.locator("#letter-" + index).dragTo(page.locator(".slot").nth(i));
                } else {
                    await page.locator("#letter-" + index).click();
                }
            }
            if (roundIndex < 4) await page.locator("#next").click();
        }
        check(
            (await page.locator("#message").textContent()).includes("5 / 5"),
            "five correct rounds including drag and repeated letters"
        );
        check(await page.locator("#next").isHidden(), "no sixth round");
        await page.locator("#start").click();
        await page.clock.fastForward(21000);
        check(
            (await page.locator("#message").textContent()).includes("หมดเวลา"),
            "word timeout ends round"
        );
        await page.locator("#start").click();
        check(
            (await page.locator("#score").textContent()) === "คะแนน 0",
            "word reset clears score"
        );
        await page.locator("#letter-0").click();
        await page.locator("#letter-0").click();
        check(
            (await page.locator(".letter:disabled").count()) === 0,
            "return letter from answer slot"
        );
        for (let i = 0; i < 3; i++) await page.locator("#letter-" + i).click();
        check(
            (await page.locator("#message").textContent()).includes("ยังไม่ถูก"),
            "wrong answer ends round without point"
        );

        await go("/matching-game/index.html");
        const cards = await page.evaluate(() => [...deck]);
        const different = cards.findIndex((value) => value !== cards[0]);
        await page.locator(".tile").nth(0).click();
        await page.locator(".tile").nth(different).click();
        check((await page.locator(".tile:disabled").count()) === 16, "mismatch locks third click");
        await page.clock.fastForward(1999);
        check(
            (await page.locator(".tile").allTextContents()).filter((x) => x !== "?").length === 2,
            "mismatch stays open before two seconds"
        );
        await page.clock.fastForward(1);
        check(
            (await page.locator(".tile").allTextContents()).every((x) => x === "?"),
            "mismatch closes after two seconds"
        );
        await page.locator(".tile").nth(0).click();
        await page.locator(".tile").nth(different).click();
        await page.locator("#reset").click();
        await page.clock.fastForward(2100);
        check(
            (await page.locator("#moves").textContent()) === "เปิดคู่ 0 ครั้ง",
            "reset cancels pending mismatch timer"
        );
        const newCards = await page.evaluate(() => [...deck]);
        for (const value of new Set(newCards)) {
            const indexes = newCards.flatMap((card, index) => (card === value ? [index] : []));
            for (let i = 0; i < indexes.length; i += 2) {
                await page.locator(".tile").nth(indexes[i]).click();
                await page
                    .locator(".tile")
                    .nth(indexes[i + 1])
                    .click();
            }
        }
        check((await page.locator(".matched").count()) === 16, "all matching pairs remain visible");
        check(
            (await page.locator("#message").textContent()).includes("ครบทุกคู่"),
            "matching game completion"
        );
        await page.locator("#reset").click();
        check((await page.locator(".matched").count()) === 0, "reset clears matched cards");
        await page.setViewportSize({ width: 375, height: 812 });
        for (const path of [
            "/",
            "/vote/vote.htm",
            "/vote/Showvote.htm",
            "/word-game/index.html",
            "/word-game/words.html",
            "/matching-game/index.html"
        ]) {
            await go(path);
            check(
                await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
                "mobile width: " + path
            );
        }
        await page.screenshot({ path: "tests/matching-mobile.png", fullPage: true });
        await page.setViewportSize({ width: 1000, height: 850 });
        for (const [name, path] of Object.entries({
            home: "/",
            vote: "/vote/vote.htm",
            result: "/vote/Showvote.htm",
            words: "/word-game/words.html",
            wordGame: "/word-game/index.html",
            matching: "/matching-game/index.html"
        })) {
            await go(path);
            if (name === "wordGame") await page.locator("#start").click();
            if (name === "matching") await page.locator(".tile").nth(0).click();
            check(
                await page
                    .locator("img")
                    .evaluateAll((images) =>
                        images.every((image) => image.complete && image.naturalWidth > 0)
                    ),
                "reference images loaded: " + name
            );
            await page.screenshot({ path: "tests/" + name + "-desktop.png", fullPage: true });
        }
        check(errors.length === 0, "no browser JavaScript errors: " + errors.join("; "));
    } finally {
        await context.close();
        await browser.close();
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
