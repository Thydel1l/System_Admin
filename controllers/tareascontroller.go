package controllers

import (
	"net/http"

	"github.com/Thydel/system_administracion_proyectos/initializers"
	"github.com/Thydel/system_administracion_proyectos/models"
	"github.com/gin-gonic/gin"
)

func GetAllTareas(c *gin.Context) {
	var tareas []models.Tarea

	if result := initializers.DB.Preload("Proyecto.Usuario").Find(&tareas); result.Error != nil {

		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": tareas})

}

// func GetTareasDNI(c *gin.Context) {
// 	Dni := c.Param("Dni")
// 	var proyectos []models.Proyecto
// 	var usuario models.Usuario
// 	if result := initializers.DB.Where("dni = ?", Dni).First(&usuario); result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Usuario no encontrado"})
// 		return
// 	}
// 	if result := initializers.DB.

// }
func GetTarea(c *gin.Context) {
	var tarea models.Tarea
	if result := initializers.DB.Preload("Proyecto.Usuario").First(&tarea, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarea no encontrada!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tarea})
}

func CreateTarea(c *gin.Context) {
	var tarea models.Tarea
	if err := c.ShouldBindJSON(&tarea); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := initializers.DB.Create(&tarea); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": tarea})
}

func UpdateTarea(c *gin.Context) {
	var tarea models.Tarea
	if result := initializers.DB.First(&tarea, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&tarea); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&tarea).Omit("created_at").Updates(&tarea); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tarea})
}

func DeleteTarea(c *gin.Context) {
	var tarea models.Tarea
	if result := initializers.DB.First(&tarea, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&tarea); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "Record deleted!"})
}
