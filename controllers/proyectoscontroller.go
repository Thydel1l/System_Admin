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
func GetProyectosDNI(c *gin.Context) {
	Dni := c.Param("Dni")
	var proyectos []models.Proyecto
	var usuario models.Usuario
	if result := initializers.DB.Where("dni = ?", Dni).First(&usuario); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Usuario no encontrado"})
		return
	}
	if result := initializers.DB.Preload("Usuario").Where("id_usuario = ?", usuario.ID).Find(&proyectos); result.Error != nil {
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

func CreateProyectoByDNI(c *gin.Context) {
	var input struct {
		Nombre      string `json:"Nombre" binding:"required"`
		Descripcion string `json:"Descripcion"`
		FechaInicio string `json:"FechaInicio" binding:"required"`
		FechaFin    string `json:"FechaFin" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	Dni := c.Param("Dni")
	var usuario models.Usuario

	// Buscar el usuario por DNI
	if result := initializers.DB.Where("dni = ?", Dni).First(&usuario); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado!"})
		return
	}

	// Crear el proyecto y asociarlo al usuario
	proyecto := models.Proyecto{
		Nombre:      input.Nombre,
		Descripcion: input.Descripcion,
		FechaInicio: input.FechaInicio,
		FechaFin:    input.FechaFin,
		IDUsuario:   usuario.ID,
	}

	// Guardar el proyecto en la base de datos
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
func UpdateProyectoByDNI(c *gin.Context) {
	var usuario models.Usuario
	Dni := c.Param("Dni")

	if result := initializers.DB.Where("dni = ?", Dni).First(&usuario); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado!"})
		return
	}

	var proyecto models.Proyecto
	projectID := c.Param("id")

	if result := initializers.DB.Where("id = ? AND id_usuario = ?", projectID, usuario.ID).First(&proyecto); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Proyecto no encontrado para el usuario dado!"})
		return
	}

	var input struct {
		Nombre      string `json:"Nombre"`
		Descripcion string `json:"Descripcion"`
		FechaInicio string `json:"FechaInicio"`
		FechaFin    string `json:"FechaFin"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Actualizar solo los campos necesarios
	if input.Nombre != "" {
		proyecto.Nombre = input.Nombre
	}
	if input.Descripcion != "" {
		proyecto.Descripcion = input.Descripcion
	}
	if input.FechaInicio != "" {
		proyecto.FechaInicio = input.FechaInicio
	}
	if input.FechaFin != "" {
		proyecto.FechaFin = input.FechaFin
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Save(&proyecto); result.Error != nil {
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
