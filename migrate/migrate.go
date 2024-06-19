package main

import (
	"github.com/Thydel/system_administracion_proyectos/initializers"
	"github.com/Thydel/system_administracion_proyectos/models"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}
func main() {
	initializers.DB.AutoMigrate(
		&models.Usuario{},
		&models.Proyecto{},
		&models.Tarea{},
		&models.ArchivoAdjunto{},
	)
}
