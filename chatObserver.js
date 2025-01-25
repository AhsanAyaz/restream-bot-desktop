// chatObserver.js
const puppeteer = require("puppeteer");
const { ipcMain } = require("electron");

const OBSERVE_INTERVAL_IN_MS = 2000;
const CHAT_SELECTOR =
  '.restream-embed-themes-chat-container .message-item:not([data-processed="true"])';
const COMMAND_PATTERN = /^!/;

async function startChatObserver(mainWindow) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.goto(process.env.RESTREAM_CHAT_LINK || "");

  setInterval(async () => {
    try {
      const messageElements = await page.$$(CHAT_SELECTOR);
      for (const element of messageElements) {
        const message = await element.evaluate((el) => ({
          text: el.querySelector(".chat-text-normal")?.textContent || "",
          username:
            el.querySelector(".MuiTypography-subtitle2")?.textContent || "",
          imageUrl: el.querySelector('[alt="avatar"]')?.src || "",
        }));

        await element.evaluate((el) =>
          el.setAttribute("data-processed", "true")
        );

        if (COMMAND_PATTERN.test(message.text)) {
          mainWindow.webContents.send("execute-command", message.text.trim());
        }
      }
    } catch (error) {
      console.error("Chat observation error:", error);
    }
  }, OBSERVE_INTERVAL_IN_MS);

  process.on("SIGINT", async () => {
    await browser.close();
  });
}

module.exports = startChatObserver;
