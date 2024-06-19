package main

import (
	"github.com/Thydel/system_administracion_proyectos/initializers"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}
