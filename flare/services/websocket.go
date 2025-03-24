package services

import (
	"fmt"
	"net/http"

	flare "FlareCast/flare"

	"github.com/gorilla/websocket"
)

type ServerService struct {
	server     *http.Server
	stopServer chan bool
	upgrader   websocket.Upgrader
}

// NewServerService creates a new ServerService
func NewServerService() *ServerService {
	return &ServerService{
		stopServer: make(chan bool),
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	}
}

// StartServer starts the server
func (s *ServerService) StartServer() {
	s.stopServer = make(chan bool)

	http.HandleFunc("/ws", s.handleConnections)
	s.server = &http.Server{Addr: ":8080"}

	go func() {
		fmt.Println("Server started on :8080")
		if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			fmt.Printf("ListenAndServe: %v\n", err)
		}
	}()

	<-s.stopServer
	if err := s.server.Close(); err != nil {
		fmt.Printf("Server Close: %v\n", err)
	}
	fmt.Println("Server stopped")
}

// StopServer stops the server
func (s *ServerService) StopServer() {
	s.stopServer <- true
}

// handleConnections handles incoming websocket connections
func (s *ServerService) handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer ws.Close()

	for {
		// Read message from browser
		_, msg, err := ws.ReadMessage()
		if err != nil {
			fmt.Println(err)
			break
		}

		msgString := string(msg)
		flare.WailsApp.EmitEvent("socket:message", map[string]string{
			"data": msgString,
		})

	}
}
