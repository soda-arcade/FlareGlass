package main

import (
	"embed"
	_ "embed"
	"flag"
	"fmt"
	"log"
	"time"

	flare "FlareCast/flare"
	"FlareCast/flare/services"

	"github.com/go-gl/glfw/v3.1/glfw"
	"github.com/wailsapp/wails/v3/pkg/application"
	//"github.com/wailsapp/wails/v3/pkg/events"
)

// Wails uses Go's `embed` package to embed the frontend files into the binary.
// Any files in the frontend/dist folder will be embedded into the binary and
// made available to the frontend.
// See https://pkg.go.dev/embed for more information.

//go:embed frontend/dist
var assets embed.FS

var (
	windowMode bool
	serverMode bool
)

// main function serves as the application's entry point. It initializes the application, creates a window,
// and starts a goroutine that emits a time-based event every second. It subsequently runs the application and
// logs any error that might occur.
func main() {

	// Initialize the GLFW library
	if glfwError := glfw.Init(); glfwError != nil {
		fmt.Println(glfwError)
	}
	defer glfw.Terminate()
	fmt.Println("GLFW initialized")

	// Parse command line arguments
	flag.Parse()
	for _, arg := range flag.Args() {
		if arg == "window" {
			windowMode = true
			fmt.Println("Window mode enabled")
		}
		if arg == "server" {
			fmt.Println("Starting WebSocket server")
			serverMode = true

			serverService := services.NewServerService()
			serverService.StartServer()
		}
	}
	windowMode = true

	// Initialize the configuration service
	configService := services.NewConfigService()

	// Initialize hotkeys
	hotkeyService := services.NewHotkeyService()

	// Overlay window
	windowService := services.NewWindowService()

	// Create a new Wails application by providing the necessary options.
	// Variables 'Name' and 'Description' are for application metadata.
	// 'Assets' configures the asset server with the 'FS' variable pointing to the frontend files.
	// 'Bind' is a list of Go struct instances. The frontend has access to the methods of these instances.
	// 'Mac' options tailor the application when running an macOS.
	app := application.New(application.Options{
		Name:        "SmashSodaOverlay",
		Description: "SmashSodaOverlay",
		Services: []application.Service{
			application.NewService(windowService),
			application.NewService(hotkeyService),
			application.NewService(&services.HookService{}),
			application.NewService(&services.PluginService{}),
			application.NewService(&services.StyleService{}),
			application.NewService(configService),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	// Environment info
	env := app.Environment()
	log.Println("Debug mode enabled: ", env.Debug)
	log.Println("OS: ", env.OS)
	log.Println("Arch: ", env.Arch)

	// App handle for the backend services
	flare.WailsApp = app

	// Get the screen resolution
	width, height := windowService.GetResolution()

	// Create a new window with the necessary options.
	// 'Title' is the title of the window.
	// 'Mac' options tailor the window when running on macOS.
	// 'BackgroundColour' is the background colour of the window.
	// 'URL' is the URL that will be loaded into the webview.
	window := app.NewWebviewWindowWithOptions(application.WebviewWindowOptions{
		Title: "SmashSodaOverlay",
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		BackgroundType:             application.BackgroundTypeTransparent,
		BackgroundColour:           application.NewRGBA(0, 0, 0, 0),
		URL:                        "/",
		Zoom:                       1,
		Width:                      width,
		Height:                     height,
		ZoomControlEnabled:         true,
		DefaultContextMenuDisabled: true,
		AlwaysOnTop:                func() bool { return !windowMode }(),
		IgnoreMouseEvents:          func() bool { return !windowMode }(),
		// StartState: func() application.WindowState {
		// 	if windowMode {
		// 		return application.WindowStateMaximised
		// 	} else {
		// 		return application.WindowStateFullscreen
		// 	}
		// }(),
		Windows: application.WindowsWindow{},
	})
	flare.WailsWindow = window

	// Fired when window has been created
	if !windowMode {
		go func() {
			// Sleep for a bit to allow the window to be created
			time.Sleep(1 * time.Second)

			// window.OnWindowEvent(events.WindowEventType(events.Common.WindowRuntimeReady), func(event *application.WindowEvent) {
			// 	window.Fullscreen().Maximise()
			// })
		}()
	}

	// Run the application. This blocks until the application has been exited.
	err := app.Run()

	// Unregister hotkeys
	hotkeyService.UnregisterAll()

	// If an error occurred while running the application, log it and exit.
	if err != nil {
		log.Fatal(err)
	}
}
