const puppeteer = require("puppeteer");
const { config } = require("dotenv");
config();

// Constants
const OBSERVE_INTERVAL_IN_MS = 2000;
const CHAT_SELECTOR =
  '.restream-embed-themes-chat-container .message-item:not([data-processed="true"])';

const COMMAND_PATTERN = /^!/;

async function parseMessage({ text, imageUrl, username }) {
  if (COMMAND_PATTERN.test(text)) {
    console.log({ imageUrl, text, username });
    ipcRenderer.send("execute-command", text.trim());
  }
}

async function extractMessageData(page, element) {
  const message = await element.evaluate((el) => {
    const imageEl = el.querySelector('[alt="avatar"]');
    const usernameEl = el.querySelector(".MuiTypography-subtitle2");
    const textEl = el.querySelector(".chat-text-normal");

    return {
      imageUrl: imageEl?.src || "",
      username: usernameEl?.textContent || "",
      text: textEl?.textContent || "",
    };
  });

  // Mark the message as processed
  await element.evaluate((el) => {
    el.setAttribute("data-processed", "true");
  });

  return message;
}

async function observeMessages(page) {
  setInterval(async () => {
    try {
      const messageElements = await page.$$(CHAT_SELECTOR);
      console.log({ messageElements });

      for (const element of messageElements) {
        const message = await extractMessageData(page, element);
        await parseMessage(message);
      }
    } catch (error) {
      console.error("Error processing messages:", error);
    }
  }, OBSERVE_INTERVAL_IN_MS);
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true in production
  });

  const page = await browser.newPage();

  // Navigate to your Restream chat page
  await page.goto(process.env.RESTREAM_CHAT_LINK || "");

  // Start observing messages
  await observeMessages(page);

  // Handle cleanup on process termination
  process.on("SIGINT", async () => {
    await browser.close();
    process.exit();
  });
}

main().catch(console.error);
