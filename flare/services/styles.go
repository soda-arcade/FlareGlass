package services

import (
	utils "FlareCast/flare/utils"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

type Style struct {
	Name string // Name of the stylesheet
	Path string // Path to the stylesheet
	CSS  string // CSS content of the stylesheet
}

type StyleService struct {
}

// NewStyleService creates a new StyleService
func NewStyleService() *StyleService {
	return &StyleService{}
}

// Loads all custom stylesheets for FlareCast overlay
func (s *StyleService) GetOverlayStyles() []Style {

	styles := make([]Style, 0)

	// Get the executable directory
	dir, err := utils.GetExecutableDir()
	if err != nil {
		fmt.Println("Error getting executable directory:", err)
		return styles
	}

	// Construct the path to the "themes" folder
	themesDir := filepath.Join(dir, "themes")
	if _, err := os.Stat(themesDir); os.IsNotExist(err) {
		fmt.Println("Themes directory does not exist:", themesDir)
		return styles
	}

	// Read all CSS files in the "themes" folder
	err = filepath.Walk(themesDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Println("Error reading file:", err)
			return err
		}
		if !info.IsDir() && filepath.Ext(info.Name()) == ".css" {

			// Get the CSS content
			themeName := strings.TrimSuffix(info.Name(), filepath.Ext(info.Name()))
			themeContent, err := ioutil.ReadFile(path)
			if err != nil {
				fmt.Println("Error reading theme file:", err)
			} else {
				// Add the CSS content to the list of styles
				style := Style{
					Name: themeName,
					Path: path,
					CSS:  string(themeContent),
				}
				styles = append(styles, style)

				fmt.Println("Found CSS theme:", themeName)
			}
		}
		return nil
	})
	if err != nil {
		return nil
	}

	return styles
}
