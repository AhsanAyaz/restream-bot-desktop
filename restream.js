const { BrowserWindow } = require("electron");
const { config } = require("dotenv");
const isDev = require("electron-is-dev");

config();

let executeCommand;
let chatWindow;
const COMMAND_PATTERN = /^!/;

function createWindows(executeCommandFn) {
  executeCommand = executeCommandFn;
  chatWindow = new BrowserWindow({
    show: false, // Hide the chat monitoring window
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  if (isDev) {
    chatWindow.webContents.openDevTools();
  }

  chatWindow.loadURL(process.env.RESTREAM_CHAT_LINK || "");

  // Handle chat window DOM ready
  chatWindow.webContents.on("dom-ready", () => {
    startChatObservation();
  });
}

function startChatObservation() {
  setInterval(async () => {
    try {
      const messages = await chatWindow.webContents.executeJavaScript(`
        Array.from(document.querySelectorAll('.restream-embed-themes-chat-container .message-item:not([data-processed="true"]'))
          .map(el => {
            const textEl = el.querySelector('.chat-text-normal');
            if (!textEl) return null;
            
            const data = {
              text: textEl.textContent.trim(),
              username: el.querySelector('.MuiTypography-subtitle2')?.textContent || '',
              imageUrl: el.querySelector('[alt="avatar"]')?.src || ''
            };
            
            el.setAttribute('data-processed', 'true');
            return data;
          }).filter(Boolean)
      `);

      messages.forEach(({ text }) => {
        if (COMMAND_PATTERN.test(text)) {
          executeCommand(text.trim());
        }
      });
    } catch (error) {
      console.error("Chat observation error:", error);
    }
  }, 2000);
}

module.exports = {
  createWindows,
};
