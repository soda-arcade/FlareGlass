/**
 * Get the platform the application is running on.
 * 
 * @returns web, win32, darwin or linux
 */
function getPlatform() {
    return import.meta.env.VITE_APP_PLATFORM;
}

/**
 * Check if the application is running on Windows.
 * 
 * @returns true if running on Windows, false otherwise
 */
function isWindows() {
    return getPlatform() === 'win32';
}

/**
 * Check if the application is running on Mac.
 * 
 * @returns true if running on Mac, false otherwise
 */
function isMac() {
    return getPlatform() === 'darwin';
}

/**
 * Check if the application is running on Linux.
 * 
 * @returns true if running on Linux, false otherwise
 */
function isLinux() {
    return getPlatform() === 'linux';
}

/**
 * Check if the application is running in a web browser.
 * 
 * @returns true if running in a web browser, false otherwise
 */
function isWeb() {
    return getPlatform() === 'web';
}

/**
 * Check if the application is running development mode.
 * 
 * @returns true if running in development mode, false otherwise
 */
function isLocal() {
    return import.meta.env.VITE_APP_ENV === 'local';
}

/**
 * Check if the application is running in production mode.
 * 
 * @returns true if running in production mode, false otherwise
 */
function isProduction() {
    return import.meta.env.VITE_APP_ENV === 'production';
}

export {
    getPlatform,
    isWindows,
    isMac,
    isLinux,
    isWeb,
    isLocal,
    isProduction,
};