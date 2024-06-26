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

func TestGetProyectosDNI(t *testing.T) {
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

	// Configurar el mock para la consulta de usuario
	userRows := sqlmock.NewRows([]string{"id", "dni", "nombres", "apellido_paterno", "apellido_materno"}).
		AddRow(1, "12345678", "John", "Doe", "Smith")

	mock.ExpectQuery("SELECT \\* FROM `usuarios` WHERE dni = \\? AND `usuarios`.`deleted_at` IS NULL ORDER BY `usuarios`.`id` LIMIT \\?").
		WithArgs("12345678", 1).
		WillReturnRows(userRows)

	// Configurar el mock para la consulta de proyectos
	projectRows := sqlmock.NewRows([]string{"id", "created_at", "updated_at", "deleted_at", "nombre", "descripcion", "fecha_inicio", "fecha_fin", "id_usuario"}).
		AddRow(1, time.Now(), time.Now(), nil, "Proyecto 1", "Descripción 1", "2023-01-01", "2023-12-31", 1).
		AddRow(2, time.Now(), time.Now(), nil, "Proyecto 2", "Descripción 2", "2023-02-01", "2023-11-30", 1)

	mock.ExpectQuery("SELECT \\* FROM `proyectos` WHERE id_usuario = \\? AND `proyectos`.`deleted_at` IS NULL").
		WithArgs(1).
		WillReturnRows(projectRows)

	// Configurar el mock para la precarga de Usuario
	userPreloadRows := sqlmock.NewRows([]string{"id", "dni", "nombres", "apellido_paterno", "apellido_materno"}).
		AddRow(1, "12345678", "John", "Doe", "Smith")

	mock.ExpectQuery("SELECT \\* FROM `usuarios` WHERE `usuarios`.`id` = \\? AND `usuarios`.`deleted_at` IS NULL").
		WithArgs(1).
		WillReturnRows(userPreloadRows)

	// Crear un contexto de Gin mock
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Simular el parámetro de DNI en la URL
	c.Params = gin.Params{gin.Param{Key: "Dni", Value: "12345678"}}

	// Llamar a la función que estamos probando
	GetProyectosDNI(c)

	// Verificar el código de estado
	assert.Equal(t, http.StatusOK, w.Code)

	// Verificar el cuerpo de la respuesta
	var response map[string][]models.Proyecto
	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)

	// Verificar que se devolvieron dos proyectos
	assert.Len(t, response["data"], 2)

	// Verificar los datos de los proyectos devueltos
	assert.Equal(t, "Proyecto 1", response["data"][0].Nombre)
	assert.Equal(t, "Descripción 1", response["data"][0].Descripcion)
	assert.Equal(t, "2023-01-01", response["data"][0].FechaInicio)
	assert.Equal(t, "2023-12-31", response["data"][0].FechaFin)
	assert.Equal(t, uint(1), response["data"][0].IDUsuario)

	assert.Equal(t, "Proyecto 2", response["data"][1].Nombre)
	assert.Equal(t, "Descripción 2", response["data"][1].Descripcion)
	assert.Equal(t, "2023-02-01", response["data"][1].FechaInicio)
	assert.Equal(t, "2023-11-30", response["data"][1].FechaFin)
	assert.Equal(t, uint(1), response["data"][1].IDUsuario)

	// Verificar que el Usuario fue precargado correctamente
	assert.Equal(t, "12345678", response["data"][0].Usuario.Dni)
	assert.Equal(t, "John", response["data"][0].Usuario.Nombres)
	assert.Equal(t, "Doe", response["data"][0].Usuario.Apellido_paterno)
	assert.Equal(t, "Smith", response["data"][0].Usuario.Apellido_materno)

	// Asegurarse de que todas las expectativas del mock se cumplieron
	assert.NoError(t, mock.ExpectationsWereMet())
}
