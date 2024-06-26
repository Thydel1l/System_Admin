package routes

import (
	"github.com/Thydel/system_administracion_proyectos/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	usuarios := router.Group("/api/v1/usuarios")
	{
		usuarios.GET("/", controllers.GetUsers)
		usuarios.GET("/:id/", controllers.GetUser)
		usuarios.PUT("/dni/:Dni", controllers.UpdateUserByDNI)
		usuarios.POST("/", controllers.CreateUser)
		usuarios.PUT("/:id/", controllers.UpdateUser)
		usuarios.DELETE("/:id/", controllers.DeleteUser)
		usuarios.DELETE("/dni/:Dni", controllers.DeleteUserByDNI)
	}
	proyectos := router.Group("/api/v1/proyectos")
	{
		proyectos.GET("/", controllers.GetAllProyectos)
		proyectos.GET("/usuario/:Dni", controllers.GetProyectosDNI)
		proyectos.GET("/:id/", controllers.GetProyecto)
		proyectos.POST("/", controllers.CreateProyecto)
		proyectos.POST("/usuario/:Dni", controllers.CreateProyectoByDNI)
		proyectos.PUT("/:id/", controllers.UpdateProyecto)
		proyectos.PUT("/usuario/:Dni/:id", controllers.UpdateProyectoByDNI)
		proyectos.DELETE("/:id/", controllers.DeleteProyecto)
	}
	tareas := router.Group("/api/v1/tareas")
	{
		tareas.GET("/", controllers.GetAllTareas)
		tareas.GET("/:id/", controllers.GetTarea)
		tareas.GET("/usuario/:Dni/proyecto/:projectID", controllers.GetTareasByDNIAndProjectID)
		tareas.GET("/proyecto/:projectID", controllers.GetTareasByProjectID)
		tareas.POST("/", controllers.CreateTarea)
		tareas.POST("/proyecto/:projectID", controllers.CreateTareaByID)
		tareas.PUT("/proyecto/:projectID/:tareaID", controllers.UpdateTareaByProjectID)
		tareas.PUT("/:id/", controllers.UpdateTarea)
		tareas.DELETE("/:id/", controllers.DeleteTarea)
	}
	archivosadjuntos := router.Group("/api/v1/archivoadjuntos")
	{
		archivosadjuntos.GET("/", controllers.GetAllArchivosAdjuntos)
		archivosadjuntos.GET("/:id/", controllers.GetArchivoAdjunto)
		archivosadjuntos.POST("/", controllers.CreateArchivoAdjunto)
		archivosadjuntos.PUT("/:id/", controllers.UpdateArchivoAdjunto)
		archivosadjuntos.DELETE("/:id/", controllers.DeleteArchivoAdjunto)

	}
	// createuser := router.Group("/api/v2/usuario")
	// {
	// 	createuser.POST("/", controllers.CreateUser)
	// }
	auth := router.Group("/api/v1/auth")
	{
		auth.POST("/login", controllers.ValidateLogin)
	}
}
