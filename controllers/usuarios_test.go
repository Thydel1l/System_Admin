package controllers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Thydel/system_administracion_proyectos/initializers"
	"github.com/Thydel/system_administracion_proyectos/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func TestGetUser(t *testing.T) {
	// Crear un mock de la base de datos
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("Error al crear mock de la base de datos: %v", err)
	}
	defer db.Close()

	gormDB, err := gorm.Open(mysql.New(mysql.Config{
		Conn:                      db,
		SkipInitializeWithVersion: true,
	}), &gorm.Config{})
	if err != nil {
		t.Fatalf("Error al crear la instancia de GORM: %v", err)
	}

	initializers.DB = gormDB

	// Configurar el mock para esperar una consulta y devolver un resultado
	createdAt, _ := time.Parse(time.RFC3339, "2024-06-25T20:49:35.375-05:00")
	updatedAt, _ := time.Parse(time.RFC3339, "2024-06-25T20:49:35.375-05:00")

	rows := sqlmock.NewRows([]string{"id", "created_at", "updated_at", "deleted_at", "dni", "nombres", "apellido_paterno", "apellido_materno", "email", "password", "rol", "fecha_nacimiento", "habilitado"}).
		AddRow(6, createdAt, updatedAt, nil, "12345678", "John", "Doe", "Smith", "john@example.com", "$2a$07$jawgdIhGVBMbfINJJYcXGOPXDxrxZCS0iLncGJLkR..mFcra6i5Te", "normal", "1988-01-23", true)

	mock.ExpectQuery("SELECT \\* FROM `usuarios` WHERE `usuarios`.`id` = \\? AND `usuarios`.`deleted_at` IS NULL ORDER BY `usuarios`.`id` LIMIT \\?").
		WithArgs("6", 1).
		WillReturnRows(rows)

	// Crear un contexto de Gin mock
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Simular el parámetro de ID en la URL
	c.Params = gin.Params{gin.Param{Key: "id", Value: "6"}}

	// Llamar a la función que estamos probando
	GetUser(c)

	// Verificar el código de estado
	assert.Equal(t, http.StatusOK, w.Code)

	// Verificar el cuerpo de la respuesta
	var response map[string]models.Usuario
	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)

	expectedUser := models.Usuario{
		Model: gorm.Model{
			ID:        6,
			CreatedAt: createdAt,
			UpdatedAt: updatedAt,
		},
		Dni:              "12345678",
		Nombres:          "John",
		Apellido_paterno: "Doe",
		Apellido_materno: "Smith",
		Email:            "john@example.com",
		Password:         "$2a$07$jawgdIhGVBMbfINJJYcXGOPXDxrxZCS0iLncGJLkR..mFcra6i5Te",
		Rol:              "normal",
		FechaNacimiento:  "1988-01-23",
		Habilitado:       true,
	}

	assert.Equal(t, expectedUser, response["data"])

	// Asegurarse de que todas las expectativas del mock se cumplieron
	assert.NoError(t, mock.ExpectationsWereMet())
}
