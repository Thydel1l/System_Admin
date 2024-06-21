package routes

import (
	"github.com/Thydel/system_administracion_proyectos/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	usuarios := router.Group("/usuarios")
	{
		usuarios.GET("/", controllers.GetUsers)
		usuarios.GET("/:id/", controllers.GetUser)
		usuarios.POST("/", controllers.CreateUser)
		usuarios.PUT("/:id/", controllers.UpdateUser)
		usuarios.DELETE("/:id/", controllers.DeleteUser)
	}
	proyectos := router.Group("/proyectos")
	{
		proyectos.GET("/", controllers.GetAllProyectos)
		proyectos.GET("/:id/", controllers.GetProyecto)
		proyectos.POST("/", controllers.CreateProyecto)
		proyectos.PUT("/:id/", controllers.UpdateProyecto)
		proyectos.DELETE("/:id/", controllers.DeleteProyecto)
	}
	tareas := router.Group("/tareas")
	{
		tareas.GET("/", controllers.GetAllTareas)
		tareas.GET("/:id/", controllers.GetTarea)
		tareas.POST("/", controllers.CreateTarea)
		tareas.PUT("/:id/", controllers.UpdateTarea)
		tareas.DELETE("/:id/", controllers.DeleteTarea)
	}
	archivosadjuntos := router.Group("/archivoadjuntos")
	{
		archivosadjuntos.GET("/", controllers.GetAllArchivosAdjuntos)
		archivosadjuntos.GET("/:id/", controllers.GetArchivoAdjunto)
		archivosadjuntos.POST("/", controllers.CreateArchivoAdjunto)
		archivosadjuntos.PUT("/:id/", controllers.UpdateArchivoAdjunto)
		archivosadjuntos.DELETE("/:id/", controllers.DeleteArchivoAdjunto)

	}
	auth := router.Group("/auth")
	{
		auth.POST("/", controllers.ValidateLogin)
	}
}
