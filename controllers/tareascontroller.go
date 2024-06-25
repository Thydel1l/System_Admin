package controllers

import (
	"net/http"
	"strconv"

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
func GetTareasByProjectID(c *gin.Context) {
	projectIDParam := c.Param("projectID")

	// Convertir projectID a uint
	projectID, err := strconv.ParseUint(projectIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	var tareas []models.Tarea
	if result := initializers.DB.Where("id_proyecto = ?", uint(projectID)).Find(&tareas); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tareas})
}
func GetTareasByDNIAndProjectID(c *gin.Context) {
	Dni := c.Param("Dni")
	projectID := c.Param("projectID")

	var usuario models.Usuario

	// Buscar el usuario por DNI para obtener su ID
	if result := initializers.DB.Where("dni = ?", Dni).First(&usuario); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado!"})
		return
	}

	var tareas []models.Tarea

	// Buscar las tareas del proyecto específico del usuario
	if result := initializers.DB.Where("id_proyecto = ? AND deleted_at IS NULL", projectID).Find(&tareas); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tareas})
}
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
func CreateTareaByID(c *gin.Context) {
	projectIDParam := c.Param("projectID")

	// Convertir projectID a uint
	projectID, err := strconv.ParseUint(projectIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	// Crear una estructura temporal para enlazar los datos del JSON
	var input struct {
		Titulo            string `json:"Titulo" binding:"required"`
		Descripcion       string `json:"Descripcion"`
		PlazoFinalizacion int    `json:"PlazoFinalizacion" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Crear la tarea asociada al proyecto
	tarea := models.Tarea{
		Titulo:            input.Titulo,
		Descripcion:       input.Descripcion,
		PlazoFinalizacion: input.PlazoFinalizacion,
		IDProyecto:        uint(projectID), // Asignar el ID del proyecto convertido a uint
	}

	// Guardar la tarea en la base de datos
	if result := initializers.DB.Create(&tarea); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
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
func UpdateTareaByProjectID(c *gin.Context) {
	tareaIDParam := c.Param("tareaID")

	// Convertir tareaID a uint
	tareaID, err := strconv.ParseUint(tareaIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var tarea models.Tarea
	// Buscar la tarea por ID
	if result := initializers.DB.First(&tarea, uint(tareaID)); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	// Crear una estructura temporal para enlazar los datos del JSON
	var input struct {
		Titulo            string `json:"Titulo"`
		Descripcion       string `json:"Descripcion"`
		PlazoFinalizacion int    `json:"PlazoFinalizacion"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Actualizar los campos necesarios
	if input.Titulo != "" {
		tarea.Titulo = input.Titulo
	}
	if input.Descripcion != "" {
		tarea.Descripcion = input.Descripcion
	}
	if input.PlazoFinalizacion != 0 {
		tarea.PlazoFinalizacion = input.PlazoFinalizacion
	}

	// Guardar los cambios en la base de datos
	if result := initializers.DB.Save(&tarea); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
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
