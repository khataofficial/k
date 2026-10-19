const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");

// Sirf ek window chale (dobara click par wahi khule)
const lock = app.requestSingleInstanceLock();
if (!lock) {
  app.quit();
}

let win;

function createWindow() {
  Menu.setApplicationMenu(null); // File/Edit menu bar hata do

  win = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 420,
    minHeight: 600,
    title: "My Khata",
    backgroundColor: "#F4F5F7",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.loadFile(path.join(__dirname, "index.html"));

  // Bahar ke links (WhatsApp, ads waghera) default browser mein khulein
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url) || /^(whatsapp|tel|mailto):/i.test(url)) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (e, url) => {
    if (!url.startsWith("file://")) {
      e.preventDefault();
      shell.openExternal(url);
    }
  });
}

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
