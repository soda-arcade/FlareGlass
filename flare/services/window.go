package services

import (
	flare "FlareCast/flare"
	"fmt"
	"syscall"

	"github.com/fstanis/screenresolution"
	"github.com/go-gl/glfw/v3.1/glfw"

	"github.com/lxn/win"
)

type WindowService struct{}

type Monitor struct {
	Name   string
	Width  int
	Height int
}

// NewWindowService creates a new WindowService
func NewWindowService() *WindowService {
	return &WindowService{}
}

// Blur the overlay window
func (ws *WindowService) Blur() {
	flare.WailsWindow.SetIgnoreMouseEvents(true)
}

// Focus the overlay window
func (ws *WindowService) Focus() {
	flare.WailsWindow.SetIgnoreMouseEvents(false)
	flare.WailsWindow.Focus()
}

func (ws *WindowService) GetResolution() (int, int) {
	resolution := screenresolution.GetPrimary()
	return resolution.Width, resolution.Height
}

func FindWindow(windowName string) win.HWND {
	window := win.FindWindow(nil, syscall.StringToUTF16Ptr(windowName))
	return window
}

func MakeWindowTransparent(hwnd win.HWND) {
	exStyle := win.GetWindowLong(hwnd, win.GWL_EXSTYLE)
	exStyle |= win.WS_EX_LAYERED
	win.SetWindowLong(hwnd, win.GWL_EXSTYLE, exStyle)
}

func (ws *WindowService) GetMonitors() []Monitor {

	list := glfw.GetMonitors()
	if len(list) == 0 {
		fmt.Println("No monitors found")
		return []Monitor{}
	}

	monitors := []Monitor{}
	for i, m := range list {
		name := m.GetName()
		mode := m.GetVideoMode()
		fmt.Printf("Monitor %d: %s (%d x %d)\n", i, name, mode.Width, mode.Height)

		// Create a new Monitor object
		monitor := Monitor{
			Name:   name,
			Width:  mode.Width,
			Height: mode.Height,
		}

		// Append the monitor to the list
		monitors = append(monitors, monitor)

	}

	return monitors

}

func (ws *WindowService) GetMonitor(index int) *glfw.Monitor {
	monitors := glfw.GetMonitors()
	if index >= len(monitors) {
		return nil
	}
	return monitors[index]
}

func (ws *WindowService) GetPrimaryMonitor() *glfw.Monitor {
	return glfw.GetPrimaryMonitor()
}

func (ws *WindowService) MoveMainWindowToMonitor(index int) {
	hwnd := FindWindow("SmashSodaOverlay")
	if hwnd == 0 {
		fmt.Println("Window not found")
		return
	}

	monitor := ws.GetMonitor(index)
	if monitor == nil {
		fmt.Println("Monitor not found")
		return
	}

	// Get the monitor's position
	x, y := monitor.GetPos()

	// Get the monitor's size
	mode := monitor.GetVideoMode()
	width, height := mode.Width, mode.Height

	// Move the window to the monitor
	win.SetWindowPos(hwnd, 0, int32(x), int32(y), int32(width), int32(height), win.SWP_NOSIZE|win.SWP_NOZORDER)

	fmt.Printf("Moved window to monitor %d: %s (%d x %d)\n", index, monitor.GetName(), width, height)

	flare.WailsWindow.Fullscreen()
	flare.WailsWindow.SetAlwaysOnTop(true)

}
