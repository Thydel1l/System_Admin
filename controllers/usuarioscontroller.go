package controllers

import (
	"net/http"

	"github.com/Thydel/system_administracion_proyectos/initializers"
	"github.com/Thydel/system_administracion_proyectos/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func GetUsers(c *gin.Context) {
	var usuarios []models.Usuario
	if result := initializers.DB.Find(&usuarios); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}

	c.JSON(200, gin.H{"data": usuarios})
}

func GetUser(c *gin.Context) {
	var usuario models.Usuario
	if result := initializers.DB.First(&usuario, c.Param("id")); result.Error != nil {
		c.JSON(404, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(200, gin.H{"data": usuario})
}

func CreateUser(c *gin.Context) {
	var usuario models.Usuario
	if err := c.ShouldBindJSON(&usuario); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	//Encriptar contraseña
	bytes, err := bcrypt.GenerateFromPassword([]byte(usuario.Password), 7)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	usuario.Password = string(bytes)

	if result := initializers.DB.Create(&usuario); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}

	c.JSON(201, gin.H{"data": usuario})
}

func UpdateUser(c *gin.Context) {
	var usuario models.Usuario
	id := c.Param("id")

	// Buscar el usuario por ID
	if result := initializers.DB.First(&usuario, id); result.Error != nil {
		c.JSON(404, gin.H{"error": "Record not found!"})
		return
	}

	// Crear una estructura temporal para enlazar los datos del JSON
	var input models.Usuario
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Encriptar la contraseña solo si se ha modificado
	if input.Password != "" {
		bytes, err := bcrypt.GenerateFromPassword([]byte(input.Password), 7)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		input.Password = string(bytes)
	}

	// Actualizar solo los campos necesarios
	updatedData := models.Usuario{
		Nombres:          input.Nombres,
		Apellido_paterno: input.Apellido_paterno,
		Apellido_materno: input.Apellido_materno,
		Email:            input.Email,
		Password:         input.Password,
		Rol:              input.Rol,
		FechaNacimiento:  input.FechaNacimiento,
		Habilitado:       input.Habilitado,
	}

	// Actualizar el usuario en la base de datos
	if result := initializers.DB.Model(&usuario).Updates(updatedData); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}

	c.JSON(200, gin.H{"data": usuario})
}
func UpdateUserByDNI(c *gin.Context) {
	var usuario models.Usuario
	Dni := c.Param("Dni")

	// Buscar el usuario por DNI
	if result := initializers.DB.Where("dni = ?", Dni).First(&usuario); result.Error != nil {
		c.JSON(404, gin.H{"error": "Usuario no encontrado!"})
		return
	}

	// Crear una estructura temporal para enlazar los datos del JSON
	var input models.Usuario
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Encriptar la contraseña solo si se ha modificado
	if input.Password != "" {
		bytes, err := bcrypt.GenerateFromPassword([]byte(input.Password), 7)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		input.Password = string(bytes)
	} else {
		// Si la contraseña no se ha modificado, mantener la actual
		input.Password = usuario.Password
	}

	// Actualizar solo los campos necesarios
	updatedData := models.Usuario{
		Nombres:          input.Nombres,
		Apellido_paterno: input.Apellido_paterno,
		Apellido_materno: input.Apellido_materno,
		Email:            input.Email,
		Password:         input.Password,
		Rol:              input.Rol,
		FechaNacimiento:  input.FechaNacimiento,
		Habilitado:       input.Habilitado,
	}

	// Actualizar el usuario en la base de datos
	if result := initializers.DB.Model(&usuario).Updates(updatedData); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}

	c.JSON(200, gin.H{"data": usuario})
}

// DeleteUser elimina un usuario por ID
func DeleteUser(c *gin.Context) {
	var usuario models.Usuario
	if result := initializers.DB.First(&usuario, c.Param("id")); result.Error != nil {
		c.JSON(404, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&usuario); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}

	c.JSON(200, gin.H{"data": true})
}
func DeleteUserByDNI(c *gin.Context) {
	dni := c.Param("Dni")

	var usuario models.Usuario
	// Buscar el usuario por DNI
	if result := initializers.DB.Where("dni = ?", dni).First(&usuario); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Eliminar el usuario de la base de datos
	if result := initializers.DB.Delete(&usuario); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": true})
}
