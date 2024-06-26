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

func TestGetTareasByProjectID(t *testing.T) {
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

	// Configurar el mock para esperar una consulta y devolver resultados
	rows := sqlmock.NewRows([]string{"id", "created_at", "updated_at", "deleted_at", "titulo", "descripcion", "plazo_finalizacion", "id_proyecto"}).
		AddRow(1, time.Now(), time.Now(), nil, "Tarea 1", "Descripción 1", 7, 1).
		AddRow(2, time.Now(), time.Now(), nil, "Tarea 2", "Descripción 2", 14, 1)

	mock.ExpectQuery("SELECT \\* FROM `tareas` WHERE id_proyecto = \\? AND `tareas`.`deleted_at` IS NULL").
		WithArgs(1).
		WillReturnRows(rows)

	// Crear un contexto de Gin mock
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Simular el parámetro de projectID en la URL
	c.Params = gin.Params{gin.Param{Key: "projectID", Value: "1"}}

	// Llamar a la función que estamos probando
	GetTareasByProjectID(c)

	// Verificar el código de estado
	assert.Equal(t, http.StatusOK, w.Code)

	// Verificar el cuerpo de la respuesta
	var response map[string][]models.Tarea
	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)

	// Verificar que se devolvieron dos tareas
	assert.Len(t, response["data"], 2)

	// Verificar los datos de las tareas devueltas
	assert.Equal(t, "Tarea 1", response["data"][0].Titulo)
	assert.Equal(t, "Descripción 1", response["data"][0].Descripcion)
	assert.Equal(t, 7, response["data"][0].PlazoFinalizacion)
	assert.Equal(t, uint(1), response["data"][0].IDProyecto)

	assert.Equal(t, "Tarea 2", response["data"][1].Titulo)
	assert.Equal(t, "Descripción 2", response["data"][1].Descripcion)
	assert.Equal(t, 14, response["data"][1].PlazoFinalizacion)
	assert.Equal(t, uint(1), response["data"][1].IDProyecto)

	// Asegurarse de que todas las expectativas del mock se cumplieron
	assert.NoError(t, mock.ExpectationsWereMet())
}
