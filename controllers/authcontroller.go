package controllers

import (
	"github.com/Thydel/system_administracion_proyectos/initializers"
	"github.com/Thydel/system_administracion_proyectos/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func ValidateLogin(c *gin.Context) {

	var usuarioJson models.UserJson
	if err := c.BindJSON(&usuarioJson); err != nil {
		c.JSON(400, gin.H{"error": "Error parsing Json"})
		return
	}
	if usuarioJson.Dni == "" || usuarioJson.Password == "" {
		c.JSON(400, gin.H{"error": "Invalid JSON provided"})
		return
	}

	var usuarioDB models.Usuario
	result := initializers.DB.Where("dni = ?", usuarioJson.Dni).First(&usuarioDB)
	if result.Error != nil {
		c.JSON(400, gin.H{"error": "Not exists dni"})
		return
	}
	err := bcrypt.CompareHashAndPassword([]byte(usuarioDB.Password), []byte(usuarioJson.Password))
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid password"})
		return
	}
	c.JSON(200, gin.H{"data": usuarioDB})
}
