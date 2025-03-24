package services

import (
	"fmt"

	flare "FlareCast/flare"

	"golang.design/x/hotkey"
)

type HotkeyService struct {
	hotkeys map[string]*hotkey.Hotkey
	events  map[string]string
}

// NewHotkeyService creates a new HotkeyService.
func NewHotkeyService() *HotkeyService {
	return &HotkeyService{
		hotkeys: make(map[string]*hotkey.Hotkey),
		events:  make(map[string]string),
	}
}

// Shutdown unregisters all hotkeys.
func (h *HotkeyService) RegisterHotkey(name string, modifiers []hotkey.Modifier, key hotkey.Key, event string) error {
	hk := hotkey.New(modifiers, key)
	err := hk.Register()
	if err != nil {
		return err
	}
	h.hotkeys[name] = hk
	h.events[name] = event
	go func() {
		for range hk.Keydown() {
			fmt.Println("Hotkey pressed: ", name)
			flare.WailsApp.EmitEvent(event, map[string]string{
				"name": name,
			})
		}
	}()
	return nil
}

// ChangeHotkey changes the hotkey with the given name to the new modifiers and key.
func (h *HotkeyService) ChangeHotkey(name string, modifiers []hotkey.Modifier, key hotkey.Key) error {
	if hk, exists := h.hotkeys[name]; exists {
		hk.Unregister()
		hk = hotkey.New(modifiers, key)
		err := hk.Register()
		if err != nil {
			return err
		}
		h.hotkeys[name] = hk
		go func() {
			for range hk.Keydown() {
				flare.WailsApp.EmitEvent(h.events[name], nil)
			}
		}()
		return nil
	}
	return fmt.Errorf("hotkey with name %s does not exist", name)
}

// UnregisterAll unregisters all hotkeys.
func (h *HotkeyService) UnregisterAll() {
	for _, hk := range h.hotkeys {
		hk.Unregister()
	}
	fmt.Println("Unregistered all hotkeys")
}
