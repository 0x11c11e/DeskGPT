const { app, BrowserWindow } = require('electron')
const path = require('path')

// Determine the platform
const isWindows = process.platform === 'win32'
const isMac = process.platform === 'darwin'
const isLinux = process.platform === 'linux'

/**
 * Gets the appropriate icon path based on the platform.
 *
 * @returns {string} Path to the icon.
 */
function getIconPath() {
  if (isWindows) {
    return path.join(__dirname, 'robot-icon.ico')
  } else if (isMac) {
    return path.join(__dirname, 'robot-icon.icns')
  } else if (isLinux) {
    return path.join(__dirname, 'robot-icon.png')
  } else {
    console.warn('Unrecognized platform. Using PNG icon as default.')
    return path.join(__dirname, 'robot-icon.png')
  }
}

let mainWindow

/**
 * Creates the main application window.
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'DeskGPT',
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // Enhanced security
      enableRemoteModule: false, // Disable remote module for increased security
    },
    icon: getIconPath(),
  })

  mainWindow.loadURL('https://chat.openai.com/').catch((err) => {
    console.error('Failed to load URL:', err)
  })

  // Handle window closed event
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // Quit the application when all windows are closed, except on macOS.
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS, recreate the window when the dock icon is clicked and no other windows are open.
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('browser-window-created', (event, window) => {
  // Ensure new windows don't run JavaScript from the web page.
  window.webContents.on('will-prevent-unload', (event) => {
    // This will prevent the unload and the user will not be prompted to leave the page.
    event.preventDefault()
  })
})
