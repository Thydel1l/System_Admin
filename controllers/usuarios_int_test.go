package controllers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Thydel/system_administracion_proyectos/controllers"
	"github.com/Thydel/system_administracion_proyectos/initializers"
	"github.com/Thydel/system_administracion_proyectos/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var testDB *gorm.DB
var router *gin.Engine

func TestMain(m *testing.M) {
	// Configurar la base de datos de prueba
	var err error
	testDB, err = gorm.Open(mysql.Open("root:password@tcp(localhost:3306)/system_proyectos?parseTime=true"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Asignar la base de datos de prueba a initializers.DB
	initializers.DB = testDB

	// Migrar el esquema
	testDB.AutoMigrate(&models.Usuario{})

	// Configurar el router
	gin.SetMode(gin.TestMode)
	router = gin.Default()
	setupRoutes(router)

	// Ejecutar las pruebas
	m.Run()

	// Limpiar después de las pruebas
	sqlDB, _ := testDB.DB()
	sqlDB.Close()
}

func setupRoutes(r *gin.Engine) {
	r.POST("/usuarios", controllers.CreateUser)
	r.GET("/usuarios/:id", controllers.GetUser)
	r.PUT("/usuarios/:id", controllers.UpdateUser)
	r.DELETE("/usuarios/:id", controllers.DeleteUser)
}

func TestUserIntegration(t *testing.T) {
	// Limpiar la base de datos antes de las pruebas
	testDB.Exec("DELETE FROM usuarios")

	// Test CreateUser
	t.Run("CreateUser", func(t *testing.T) {
		userData := models.Usuario{
			Dni:              "12345678",
			Nombres:          "John",
			Apellido_paterno: "Doe",
			Apellido_materno: "Smith",
			Email:            "john@example.com",
			Password:         "password123",
			Rol:              "normal",
			FechaNacimiento:  "1990-01-01",
			Habilitado:       true,
		}
		jsonData, _ := json.Marshal(userData)
		req, _ := http.NewRequest("POST", "/usuarios", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)

		var response map[string]models.Usuario
		json.Unmarshal(w.Body.Bytes(), &response)
		createdUser := response["data"]
		assert.NotEmpty(t, createdUser.ID)
		assert.Equal(t, userData.Dni, createdUser.Dni)
	})

	// Test GetUser
	t.Run("GetUser", func(t *testing.T) {
		var user models.Usuario
		testDB.First(&user)

		req, _ := http.NewRequest("GET", "/usuarios/"+string(rune(user.ID)), nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]models.Usuario
		json.Unmarshal(w.Body.Bytes(), &response)
		fetchedUser := response["data"]
		assert.Equal(t, user.ID, fetchedUser.ID)
		assert.Equal(t, user.Dni, fetchedUser.Dni)
	})

	// Test UpdateUser
	t.Run("UpdateUser", func(t *testing.T) {
		var user models.Usuario
		testDB.First(&user)

		updatedData := models.Usuario{
			Nombres: "Jane",
			Email:   "jane@example.com",
		}
		jsonData, _ := json.Marshal(updatedData)
		req, _ := http.NewRequest("PUT", "/usuarios/"+string(rune(user.ID)), bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]models.Usuario
		json.Unmarshal(w.Body.Bytes(), &response)
		updatedUser := response["data"]
		assert.Equal(t, updatedData.Nombres, updatedUser.Nombres)
		assert.Equal(t, updatedData.Email, updatedUser.Email)
	})

	// Test DeleteUser
	t.Run("DeleteUser", func(t *testing.T) {
		var user models.Usuario
		testDB.First(&user)

		req, _ := http.NewRequest("DELETE", "/usuarios/"+string(rune(user.ID)), nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var deletedUser models.Usuario
		result := testDB.First(&deletedUser, user.ID)
		assert.Error(t, result.Error) // Should not find the deleted user
	})
}
