package main

import (
	"log"

	"github.com/Thydel/system_administracion_proyectos/initializers"
	"github.com/Thydel/system_administracion_proyectos/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	// Inicializar la conexión a la base de datos
	initializers.LoadEnvVariables()
	err := initializers.ConnectToDB()
	if err != nil {
		log.Fatalf("Error al conectar a la base de datos: %v", err)
	}
}

func main() {
	router := gin.Default()

	// Configuración del middleware CORS
	config := cors.Config{
		AllowOrigins:     []string{"http://localhost:9000", "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}

	router.Use(cors.New(config))

	// Configurar las rutas de la aplicación
	routes.SetupRoutes(router)

	// Ejecutar la aplicación en el puerto especificado (por ejemplo, 8080)
	err := router.Run(":8080")
	if err != nil {
		log.Fatalf("Error al iniciar el servidor: %v", err)
	}
}
