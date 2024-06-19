package controllers

import (
	"net/http"

	"github.com/Thydel/system_administracion_proyectos/initializers"
	"github.com/Thydel/system_administracion_proyectos/models"
	"github.com/gin-gonic/gin"
)

func GetAllArchivosAdjuntos(c *gin.Context) {
	var archivosadjuntos []models.ArchivoAdjunto
	if result := initializers.DB.Find(&archivosadjuntos); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": archivosadjuntos})
}

func GetArchivoAdjunto(c *gin.Context) {
	var archivoadjunto models.ArchivoAdjunto
	if result := initializers.DB.First(&archivoadjunto, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": archivoadjunto})
}

func CreateArchivoAdjunto(c *gin.Context) {
	var archivoadjunto models.ArchivoAdjunto
	if err := c.ShouldBindJSON(&archivoadjunto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := initializers.DB.Create(&archivoadjunto); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": archivoadjunto})
}

func UpdateArchivoAdjunto(c *gin.Context) {
	var archivoadjunto models.ArchivoAdjunto
	if result := initializers.DB.First(&archivoadjunto, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&archivoadjunto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&archivoadjunto).Omit("created_at").Updates(&archivoadjunto); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": archivoadjunto})
}

func DeleteArchivoAdjunto(c *gin.Context) {
	var archivoadjunto models.ArchivoAdjunto
	if result := initializers.DB.First(&archivoadjunto, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&archivoadjunto); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "Record deleted!"})
}
