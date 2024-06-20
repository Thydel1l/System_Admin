package controllers

import (
	"net/http"

	"github.com/Thydel/system_administracion_proyectos/initializers"
	"github.com/Thydel/system_administracion_proyectos/models"
	"github.com/gin-gonic/gin"
)

func GetAllProyectos(c *gin.Context) {
	var proyectos []models.Proyecto
	if result := initializers.DB.Preload("Usuario").Find(&proyectos); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": proyectos})
}

func GetProyecto(c *gin.Context) {
	var proyecto models.Proyecto
	if result := initializers.DB.Preload("Usuario").First(&proyecto, c.Param("id")); result.Error != nil {
		c.JSON(404, gin.H{"error": "Proyecto no encontrado"})
		return
	}

	c.JSON(200, gin.H{"data": proyecto})
}
func CreateProyecto(c *gin.Context) {
	var proyecto models.Proyecto
	if err := c.ShouldBindJSON(&proyecto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := initializers.DB.Create(&proyecto); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": proyecto})
}

func UpdateProyecto(c *gin.Context) {
	var proyecto models.Proyecto
	if result := initializers.DB.First(&proyecto, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&proyecto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&proyecto).Omit("created_at").Updates(&proyecto); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": proyecto})
}

func DeleteProyecto(c *gin.Context) {
	var proyecto models.Proyecto
	if result := initializers.DB.First(&proyecto, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&proyecto); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "Record deleted!"})
}
