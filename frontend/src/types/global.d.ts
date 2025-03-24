import EventType from "@/enums/EventType";
import runtime from '@wailsio/runtime';

export { }

type TranslateResult = string | number | (string | number)[];

declare global {
    interface Window {

        /**
         * I18n plugin.
         */
        $i18n: {

            /**
             * The global instance of VueI18n.
             */
            global: {
                /**
                 * Available locales.
                 */
                availableLocales: string[];
                /**
                 * @remarks
                 * The current locale this VueI18n instance is using.
                 *
                 * If the locale contains a territory and a dialect, this locale contains an implicit fallback.
                 *
                 * @VueI18nSee [Scope and Locale Changing](../guide/essentials/scope)
                 */
                locale: string;

                /**
                 * @remarks
                 * The current fallback locales this VueI18n instance is using.
                 *
                 * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
                 */
                t: (key: string, values?: Record<string, string | number> | string[]) => string;
            }

        };
        axios: any;

        /**
         * jQuery
         */
        $: any;

        /**
         * jQuery
         */
        jQuery: any;

        /**
         * For push notifications.
         */
        $pusher: any;

        /**
         * Laravel Echo.
         */
        $echo: any;

        /**
         * Vue router.
         */
        $router: any;

        /**
         * My janky fix for the overlay issue.
         * ! This is a temporary fix and should be removed once the issue is resolved with Wails.
         */
        $overlay: boolean;

        /**
         * Wails runtime.
         */
        $runtime: typeof runtime;

        /**
         * Unread messages count.
         */
        $unreadMessages: number;

        /**
         * Unread notifications count.
         */
        $unreadNotifications: number;

        /**
         * Online users count.
         */
        $onlineUsers: number;

        /**
         * Toast success message.
         * @param {string} message Message to display.
         */
        $toastSuccess: (message: string) => void;

        /**
         * Toast error message.
         * @param {string} message Message to display.
         */
        $toastError: (message: string) => void;

        /**
         * Toast info message.
         * @param {string} message Message to display.
         */
        $toastInfo: (message: string) => void;

        /**
         * Toast warning message.
         * @param {string} message Message to display.
         */
        $toastWarning: (message: string) => void;

        /**
         * Toast notification message.
         * @param {string}
         */
        $toastNotification: (message: string) => void;

        /*
        -----------------------------------
        TAURI
        -----------------------------------
        */

        /**
         * Shows a question dialog with `Yes` and `No` buttons.
         * @example
         * ```typescript
         * const yes = await $ask('Are you sure?');
         * ```
         *
         * @param message The message to show.
         *
         * @returns A promise resolving to a boolean indicating whether `Yes` was clicked or not.
         */
        $ask: (message: string) => Promise<boolean>;

        /**
         * Sends a message to the backend. Only available in the Tauri runtime.
         * @example
         * ```typescript
         * await invoke('login', { user: 'tauri', password: 'poiwe3h4r5ip3yrhtew9ty' });
         * ```
         *
         * @param cmd The command name.
         * @param args The optional arguments to pass to the command.
         * @param options The request options.
         * @return A promise resolving or rejecting to the backend response.
         */
        $invoke: <T>(cmd: string, args?: Record<string, unknown>, options?: { headers: Record<string, string> }) => Promise<T>;

        /**
         * Listen to an emitted event to any {@link EventTarget|target}. Only available in the Tauri runtime.
         *
         * @example
         * ```typescript
         * const unlisten = await listen<string>('error', (event) => {
         *   console.log(`Got error, payload: ${event.payload}`);
         * });
         *
         * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
         * unlisten();
         * ```
         *
         * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
         * @param handler Event handler callback.
         * @param options Event listening options.
         * @returns A promise resolving to a function to unlisten to the event.
         * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
         *
         * @since 1.0.0
         */
        $listen: <T>(event: string, handler: (event: any) => void, options?: any) => Promise<() => void>;

        /**
         * The Tauri window API. Only available in the Tauri runtime.
         */
        $current: {
            /**
             * The scale factor that can be used to map physical pixels to logical pixels.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const factor = await getCurrent().scaleFactor();
             * ```
             *
             * @returns The window's monitor scale factor.
             */
            scaleFactor(): Promise<number>;
            /**
             * The position of the top-left hand corner of the window's client area relative to the top-left hand corner of the desktop.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const position = await getCurrent().innerPosition();
             * ```
             *
             * @returns The window's inner position.
             */
            innerPosition(): Promise<any>;
            /**
             * The position of the top-left hand corner of the window relative to the top-left hand corner of the desktop.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const position = await getCurrent().outerPosition();
             * ```
             *
             * @returns The window's outer position.
             */
            outerPosition(): Promise<any>;
            /**
             * The physical size of the window's client area.
             * The client area is the content of the window, excluding the title bar and borders.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const size = await getCurrent().innerSize();
             * ```
             *
             * @returns The window's inner size.
             */
            innerSize(): Promise<any>;
            /**
             * The physical size of the entire window.
             * These dimensions include the title bar and borders. If you don't want that (and you usually don't), use inner_size instead.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const size = await getCurrent().outerSize();
             * ```
             *
             * @returns The window's outer size.
             */
            outerSize(): Promise<any>;
            /**
             * Gets the window's current fullscreen state.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const fullscreen = await getCurrent().isFullscreen();
             * ```
             *
             * @returns Whether the window is in fullscreen mode or not.
             */
            isFullscreen(): Promise<boolean>;
            /**
             * Gets the window's current minimized state.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const minimized = await getCurrent().isMinimized();
             * ```
             */
            isMinimized(): Promise<boolean>;
            /**
             * Gets the window's current maximized state.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const maximized = await getCurrent().isMaximized();
             * ```
             *
             * @returns Whether the window is maximized or not.
             */
            isMaximized(): Promise<boolean>;
            /**
             * Gets the window's current focus state.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const focused = await getCurrent().isFocused();
             * ```
             *
             * @returns Whether the window is focused or not.
             */
            isFocused(): Promise<boolean>;
            /**
             * Gets the window's current decorated state.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const decorated = await getCurrent().isDecorated();
             * ```
             *
             * @returns Whether the window is decorated or not.
             */
            isDecorated(): Promise<boolean>;
            /**
             * Gets the window's current resizable state.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const resizable = await getCurrent().isResizable();
             * ```
             *
             * @returns Whether the window is resizable or not.
             */
            isResizable(): Promise<boolean>;
            /**
             * Gets the window’s native maximize button state.
             *
             * #### Platform-specific
             *
             * - **Linux / iOS / Android:** Unsupported.
             *
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const maximizable = await getCurrent().isMaximizable();
             * ```
             *
             * @returns Whether the window's native maximize button is enabled or not.
             */
            isMaximizable(): Promise<boolean>;
            /**
             * Gets the window’s native minimize button state.
             *
             * #### Platform-specific
             *
             * - **Linux / iOS / Android:** Unsupported.
             *
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const minimizable = await getCurrent().isMinimizable();
             * ```
             *
             * @returns Whether the window's native minimize button is enabled or not.
             */
            isMinimizable(): Promise<boolean>;
            /**
             * Gets the window’s native close button state.
             *
             * #### Platform-specific
             *
             * - **iOS / Android:** Unsupported.
             *
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const closable = await getCurrent().isClosable();
             * ```
             *
             * @returns Whether the window's native close button is enabled or not.
             */
            isClosable(): Promise<boolean>;
            /**
             * Gets the window's current visible state.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const visible = await getCurrent().isVisible();
             * ```
             *
             * @returns Whether the window is visible or not.
             */
            isVisible(): Promise<boolean>;
            /**
             * Gets the window's current title.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const title = await getCurrent().title();
             * ```
             */
            title(): Promise<string>;
            /**
             * Gets the window's current theme.
             *
             * #### Platform-specific
             *
             * - **macOS:** Theme was introduced on macOS 10.14. Returns `light` on macOS 10.13 and below.
             *
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * const theme = await getCurrent().theme();
             * ```
             *
             * @returns The window theme.
             */
            theme(): Promise<any>;
            /**
             * Centers the window.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().center();
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            center(): Promise<void>;
            /**
             *  Requests user attention to the window, this has no effect if the application
             * is already focused. How requesting for user attention manifests is platform dependent,
             * see `UserAttentionType` for details.
             *
             * Providing `null` will unset the request for user attention. Unsetting the request for
             * user attention might not be done automatically by the WM when the window receives input.
             *
             * #### Platform-specific
             *
             * - **macOS:** `null` has no effect.
             * - **Linux:** Urgency levels have the same effect.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().requestUserAttention();
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            requestUserAttention(requestType: any | null): Promise<void>;
            /**
             * Updates the window resizable flag.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setResizable(false);
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            setResizable(resizable: boolean): Promise<void>;
            /**
             * Sets whether the window's native maximize button is enabled or not.
             * If resizable is set to false, this setting is ignored.
             *
             * #### Platform-specific
             *
             * - **macOS:** Disables the "zoom" button in the window titlebar, which is also used to enter fullscreen mode.
             * - **Linux / iOS / Android:** Unsupported.
             *
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setMaximizable(false);
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            setMaximizable(maximizable: boolean): Promise<void>;
            /**
             * Sets whether the window's native minimize button is enabled or not.
             *
             * #### Platform-specific
             *
             * - **Linux / iOS / Android:** Unsupported.
             *
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setMinimizable(false);
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            setMinimizable(minimizable: boolean): Promise<void>;
            /**
             * Sets whether the window's native close button is enabled or not.
             *
             * #### Platform-specific
             *
             * - **Linux:** GTK+ will do its best to convince the window manager not to show a close button. Depending on the system, this function may not have any effect when called on a window that is already visible
             * - **iOS / Android:** Unsupported.
             *
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setClosable(false);
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            setClosable(closable: boolean): Promise<void>;
            /**
             * Sets the window title.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setTitle('Tauri');
             * ```
             *
             * @param title The new title
             * @returns A promise indicating the success or failure of the operation.
             */
            setTitle(title: string): Promise<void>;
            /**
             * Maximizes the window.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().maximize();
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            maximize(): Promise<void>;
            /**
             * Unmaximizes the window.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().unmaximize();
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            unmaximize(): Promise<void>;
            /**
             * Toggles the window maximized state.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().toggleMaximize();
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            toggleMaximize(): Promise<void>;
            /**
             * Minimizes the window.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().minimize();
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            minimize(): Promise<void>;
            /**
             * Unminimizes the window.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().unminimize();
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            unminimize(): Promise<void>;
            /**
             * Sets the window visibility to true.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().show();
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            show(): Promise<void>;
            /**
             * Sets the window visibility to false.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().hide();
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            hide(): Promise<void>;
            /**
             * Closes the window.
             *
             * Note this emits a closeRequested event so you can intercept it. To force window close, use {@link Window.destroy}.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().close();
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            close(): Promise<void>;
            /**
             * Destroys the window. Behaves like {@link Window.close} but forces the window close instead of emitting a closeRequested event.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().destroy();
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            destroy(): Promise<void>;
            /**
             * Whether the window should have borders and bars.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setDecorations(false);
             * ```
             *
             * @param decorations Whether the window should have borders and bars.
             * @returns A promise indicating the success or failure of the operation.
             */
            setDecorations(decorations: boolean): Promise<void>;
            /**
             * Whether or not the window should have shadow.
             *
             * #### Platform-specific
             *
             * - **Windows:**
             *   - `false` has no effect on decorated window, shadows are always ON.
             *   - `true` will make ndecorated window have a 1px white border,
             * and on Windows 11, it will have a rounded corners.
             * - **Linux:** Unsupported.
             *
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setShadow(false);
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            setShadow(enable: boolean): Promise<void>;
            /**
             * Set window effects.
             */
            setEffects(effects: any): Promise<void>;
            /**
             * Clear any applied effects if possible.
             */
            clearEffects(): Promise<void>;
            /**
             * Whether the window should always be on top of other windows.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setAlwaysOnTop(true);
             * ```
             *
             * @param alwaysOnTop Whether the window should always be on top of other windows or not.
             * @returns A promise indicating the success or failure of the operation.
             */
            setAlwaysOnTop(alwaysOnTop: boolean): Promise<void>;
            /**
             * Whether the window should always be below other windows.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setAlwaysOnBottom(true);
             * ```
             *
             * @param alwaysOnBottom Whether the window should always be below other windows or not.
             * @returns A promise indicating the success or failure of the operation.
             */
            setAlwaysOnBottom(alwaysOnBottom: boolean): Promise<void>;
            /**
             * Prevents the window contents from being captured by other apps.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setContentProtected(true);
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            setContentProtected(protected_: boolean): Promise<void>;
            /**
             * Resizes the window with a new inner size.
             * @example
             * ```typescript
             * import { getCurrent, LogicalSize } from '@tauri-apps/api/window';
             * await getCurrent().setSize(new LogicalSize(600, 500));
             * ```
             *
             * @param size The logical or physical inner size.
             * @returns A promise indicating the success or failure of the operation.
             */
            setSize(size: any): Promise<void>;
            /**
             * Sets the window minimum inner size. If the `size` argument is not provided, the constraint is unset.
             * @example
             * ```typescript
             * import { getCurrent, PhysicalSize } from '@tauri-apps/api/window';
             * await getCurrent().setMinSize(new PhysicalSize(600, 500));
             * ```
             *
             * @param size The logical or physical inner size, or `null` to unset the constraint.
             * @returns A promise indicating the success or failure of the operation.
             */
            setMinSize(size: any | null | undefined): Promise<void>;
            /**
             * Sets the window maximum inner size. If the `size` argument is undefined, the constraint is unset.
             * @example
             * ```typescript
             * import { getCurrent, LogicalSize } from '@tauri-apps/api/window';
             * await getCurrent().setMaxSize(new LogicalSize(600, 500));
             * ```
             *
             * @param size The logical or physical inner size, or `null` to unset the constraint.
             * @returns A promise indicating the success or failure of the operation.
             */
            setMaxSize(size: any | null | undefined): Promise<void>;
            /**
             * Sets the window outer position.
             * @example
             * ```typescript
             * import { getCurrent, LogicalPosition } from '@tauri-apps/api/window';
             * await getCurrent().setPosition(new LogicalPosition(600, 500));
             * ```
             *
             * @param position The new position, in logical or physical pixels.
             * @returns A promise indicating the success or failure of the operation.
             */
            setPosition(position: any): Promise<void>;
            /**
             * Sets the window fullscreen state.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setFullscreen(true);
             * ```
             *
             * @param fullscreen Whether the window should go to fullscreen or not.
             * @returns A promise indicating the success or failure of the operation.
             */
            setFullscreen(fullscreen: boolean): Promise<void>;
            /**
             * Bring the window to front and focus.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setFocus();
             * ```
             *
             * @returns A promise indicating the success or failure of the operation.
             */
            setFocus(): Promise<void>;
            /**
             * Sets the window icon.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setIcon('/tauri/awesome.png');
             * ```
             *
             * Note that you need the `image-ico` or `image-png` Cargo features to use this API.
             * To enable it, change your Cargo.toml file:
             * ```toml
             * [dependencies]
             * tauri = { version = "...", features = ["...", "image-png"] }
             * ```
             *
             * @param icon Icon bytes or path to the icon file.
             * @returns A promise indicating the success or failure of the operation.
             */
            setIcon(icon: string | any | Uint8Array | ArrayBuffer | number[]): Promise<void>;
            /**
             * Whether the window icon should be hidden from the taskbar or not.
             *
             * #### Platform-specific
             *
             * - **macOS:** Unsupported.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setSkipTaskbar(true);
             * ```
             *
             * @param skip true to hide window icon, false to show it.
             * @returns A promise indicating the success or failure of the operation.
             */
            setSkipTaskbar(skip: boolean): Promise<void>;
            /**
             * Grabs the cursor, preventing it from leaving the window.
             *
             * There's no guarantee that the cursor will be hidden. You should
             * hide it by yourself if you want so.
             *
             * #### Platform-specific
             *
             * - **Linux:** Unsupported.
             * - **macOS:** This locks the cursor in a fixed location, which looks visually awkward.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setCursorGrab(true);
             * ```
             *
             * @param grab `true` to grab the cursor icon, `false` to release it.
             * @returns A promise indicating the success or failure of the operation.
             */
            setCursorGrab(grab: boolean): Promise<void>;
            /**
             * Modifies the cursor's visibility.
             *
             * #### Platform-specific
             *
             * - **Windows:** The cursor is only hidden within the confines of the window.
             * - **macOS:** The cursor is hidden as long as the window has input focus, even if the cursor is
             *   outside of the window.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setCursorVisible(false);
             * ```
             *
             * @param visible If `false`, this will hide the cursor. If `true`, this will show the cursor.
             * @returns A promise indicating the success or failure of the operation.
             */
            setCursorVisible(visible: boolean): Promise<void>;
            /**
             * Modifies the cursor icon of the window.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setCursorIcon('help');
             * ```
             *
             * @param icon The new cursor icon.
             * @returns A promise indicating the success or failure of the operation.
             */
            setCursorIcon(icon: any): Promise<void>;
            /**
             * Changes the position of the cursor in window coordinates.
             * @example
             * ```typescript
             * import { getCurrent, LogicalPosition } from '@tauri-apps/api/window';
             * await getCurrent().setCursorPosition(new LogicalPosition(600, 300));
             * ```
             *
             * @param position The new cursor position.
             * @returns A promise indicating the success or failure of the operation.
             */
            setCursorPosition(position: any): Promise<void>;
            /**
             * Changes the cursor events behavior.
             *
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().setIgnoreCursorEvents(true);
             * ```
             *
             * @param ignore `true` to ignore the cursor events; `false` to process them as usual.
             * @returns A promise indicating the success or failure of the operation.
             */
            setIgnoreCursorEvents(ignore: boolean): Promise<void>;
            /**
             * Starts dragging the window.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().startDragging();
             * ```
             *
             * @return A promise indicating the success or failure of the operation.
             */
            startDragging(): Promise<void>;
            /**
             * Starts resize-dragging the window.
             * @example
             * ```typescript
             * import { getCurrent } from '@tauri-apps/api/window';
             * await getCurrent().startResizeDragging();
             * ```
             *
             * @return A promise indicating the success or failure of the operation.
             */
            startResizeDragging(direction: any): Promise<void>;
            /**
             * Sets the taskbar progress state.
             *
             * #### Platform-specific
             *
             * - **Linux / macOS**: Progress bar is app-wide and not specific to this window.
             * - **Linux**: Only supported desktop environments with `libunity` (e.g. GNOME).
             *
             * @example
             * ```typescript
             * import { getCurrent, ProgressBarStatus } from '@tauri-apps/api/window';
             * await getCurrent().setProgressBar({
             *   status: ProgressBarStatus.Normal,
             *   progress: 50,
             * });
             * ```
             *
             * @return A promise indicating the success or failure of the operation.
             */
            setProgressBar(state: any): Promise<void>;
            /**
             * Sets whether the window should be visible on all workspaces or virtual desktops.
             *
             * ## Platform-specific
             *
             * - **Windows / iOS / Android:** Unsupported.
             *
             * @since 2.0.0
             */
            setVisibleOnAllWorkspaces(visible: boolean): Promise<void>;
            /**
             * Listen to window resize.
             *
             * @example
             * ```typescript
             * import { getCurrent } from "@tauri-apps/api/window";
             * const unlisten = await getCurrent().onResized(({ payload: size }) => {
             *  console.log('Window resized', size);
             * });
             *
             * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
             * unlisten();
             * ```
             *
             * @returns A promise resolving to a function to unlisten to the event.
             * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
             */
            onResized(handler: any): Promise<any>;
            /**
             * Listen to window move.
             *
             * @example
             * ```typescript
             * import { getCurrent } from "@tauri-apps/api/window";
             * const unlisten = await getCurrent().onMoved(({ payload: position }) => {
             *  console.log('Window moved', position);
             * });
             *
             * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
             * unlisten();
             * ```
             *
             * @returns A promise resolving to a function to unlisten to the event.
             * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
             */
            onMoved(handler: any): Promise<any>;
            /**
             * Listen to window close requested. Emitted when the user requests to closes the window.
             *
             * @example
             * ```typescript
             * import { getCurrent } from "@tauri-apps/api/window";
             * import { confirm } from '@tauri-apps/api/dialog';
             * const unlisten = await getCurrent().onCloseRequested(async (event) => {
             *   const confirmed = await confirm('Are you sure?');
             *   if (!confirmed) {
             *     // user did not confirm closing the window; let's prevent it
             *     event.preventDefault();
             *   }
             * });
             *
             * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
             * unlisten();
             * ```
             *
             * @returns A promise resolving to a function to unlisten to the event.
             * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
             */
            onCloseRequested(handler: (event: any) => void | Promise<void>): Promise<any>;
            /**
             * Listen to a file drop event.
             * The listener is triggered when the user hovers the selected files on the webview,
             * drops the files or cancels the operation.
             *
             * @example
             * ```typescript
             * import { getCurrent } from "@tauri-apps/api/webview";
             * const unlisten = await getCurrent().onFileDropEvent((event) => {
             *  if (event.payload.type === 'hover') {
             *    console.log('User hovering', event.payload.paths);
             *  } else if (event.payload.type === 'drop') {
             *    console.log('User dropped', event.payload.paths);
             *  } else {
             *    console.log('File drop cancelled');
             *  }
             * });
             *
             * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
             * unlisten();
             * ```
             *
             * @returns A promise resolving to a function to unlisten to the event.
             * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
             */
            onFileDropEvent(handler: any): Promise<any>;
            /**
             * Listen to window focus change.
             *
             * @example
             * ```typescript
             * import { getCurrent } from "@tauri-apps/api/window";
             * const unlisten = await getCurrent().onFocusChanged(({ payload: focused }) => {
             *  console.log('Focus changed, window is focused? ' + focused);
             * });
             *
             * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
             * unlisten();
             * ```
             *
             * @returns A promise resolving to a function to unlisten to the event.
             * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
             */
            onFocusChanged(handler: any): Promise<any>;
            /**
             * Listen to window scale change. Emitted when the window's scale factor has changed.
             * The following user actions can cause DPI changes:
             * - Changing the display's resolution.
             * - Changing the display's scale factor (e.g. in Control Panel on Windows).
             * - Moving the window to a display with a different scale factor.
             *
             * @example
             * ```typescript
             * import { getCurrent } from "@tauri-apps/api/window";
             * const unlisten = await getCurrent().onScaleChanged(({ payload }) => {
             *  console.log('Scale changed', payload.scaleFactor, payload.size);
             * });
             *
             * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
             * unlisten();
             * ```
             *
             * @returns A promise resolving to a function to unlisten to the event.
             * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
             */
            onScaleChanged(handler: any): Promise<any>;
            /**
             * Listen to the system theme change.
             *
             * @example
             * ```typescript
             * import { getCurrent } from "@tauri-apps/api/window";
             * const unlisten = await getCurrent().onThemeChanged(({ payload: theme }) => {
             *  console.log('New theme: ' + theme);
             * });
             *
             * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
             * unlisten();
             * ```
             *
             * @returns A promise resolving to a function to unlisten to the event.
             * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
             */
            onThemeChanged(handler: any): Promise<any>;
        };
    }

    interface JQuery {
        datetimepicker(options?: any): JQuery;
        datetimepicker(methodName: string, methodParameter?: any): any;
    }
}
  