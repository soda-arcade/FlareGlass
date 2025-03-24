package services

import (
	utils "FlareCast/flare/utils"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

type Plugin struct {
	Name string // Name of the plugin
	Path string // Path to the plugin
	HTML string // HTML content of the plugin
	JS   string // JS content of the plugin
	CSS  string // CSS content of the plugin
}

type PluginService struct{}

// NewStyleService creates a new StyleService
func NewPluginService() *PluginService {
	return &PluginService{}
}

// Loads all custom stylesheets for FlareCast overlay
func (s *PluginService) LoadPlugins() []Plugin {
	// Read all plugin files in the "plugins" folder
	plugins := make([]Plugin, 0)

	// Get the executable directory
	dir, err := utils.GetExecutableDir()
	if err != nil {
		fmt.Println("Error getting executable directory:", err)
		return plugins
	}

	// Construct the path to the "themes" folder
	pluginsDir := filepath.Join(dir, "plugins")
	if _, err := os.Stat(pluginsDir); os.IsNotExist(err) {
		fmt.Println("Themes directory does not exist:", pluginsDir)
		return plugins
	}

	// A plugin is a subfolder, that contains a HTML, CSS and JS file
	// The subfolder name is the plugin name
	// The HTML file is the plugin content
	// The CSS file is the plugin style
	// The JS file is the plugin script

	// Get all subfolders in the "plugins" folder
	pluginDirs, err := ioutil.ReadDir(pluginsDir)

	// Iterate over all subfolders
	for _, pluginDir := range pluginDirs {
		if pluginDir.IsDir() {
			pluginName := pluginDir.Name()

			// Get the HTML content
			htmlPath := filepath.Join(pluginsDir, pluginName, pluginName+".html")
			htmlContent, htmlErr := ioutil.ReadFile(htmlPath)
			if htmlErr != nil {
				fmt.Println("Error reading HTML file:", htmlErr)
				continue
			}

			// Get the CSS content
			cssPath := filepath.Join(pluginsDir, pluginName, pluginName+".css")
			cssContent, cssErr := ioutil.ReadFile(cssPath)
			if cssErr != nil {
				// Don't need a css file, default to empty string
				cssContent = []byte("")
			}

			// Get the JS content
			jsPath := filepath.Join(pluginsDir, pluginName, pluginName+".js")
			jsContent, jsErr := ioutil.ReadFile(jsPath)
			if jsErr != nil {
				// Don't need a js file, default to empty string
				jsContent = []byte("")
			}

			plugin := Plugin{
				Name: pluginName,
				Path: htmlPath,
				HTML: string(htmlContent),
				CSS:  string(cssContent),
				JS:   string(jsContent),
			}
			plugins = append(plugins, plugin)

		}
	}

	return plugins
}
