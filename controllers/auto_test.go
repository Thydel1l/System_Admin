package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Thydel/system_administracion_proyectos/initializers"
	"github.com/Thydel/system_administracion_proyectos/models"
	"github.com/gin-gonic/gin"
	. "github.com/smartystreets/goconvey/convey"
)

// Setup function to initialize the Gin router and DB connection
func setupRouter() *gin.Engine {
	router := gin.Default()
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	return router
}

func TestGetUsers(t *testing.T) {
	router := setupRouter()
	router.GET("/users", GetUsers)

	Convey("GET /users", t, func() {
		req, _ := http.NewRequest("GET", "/users", nil)
		resp := httptest.NewRecorder()
		router.ServeHTTP(resp, req)

		Convey("Should return status 200", func() {
			So(resp.Code, ShouldEqual, 200)
		})

		Convey("Should return a list of users", func() {
			var response map[string][]models.Usuario
			json.Unmarshal(resp.Body.Bytes(), &response)
			So(response["data"], ShouldNotBeEmpty)
		})
	})
}

func TestGetUser(t *testing.T) {
	router := setupRouter()
	router.GET("/users/:id", GetUser)

	Convey("GET /users/:id", t, func() {
		req, _ := http.NewRequest("GET", "/users/1", nil)
		resp := httptest.NewRecorder()
		router.ServeHTTP(resp, req)

		Convey("Should return status 200", func() {
			So(resp.Code, ShouldEqual, 200)
		})

		Convey("Should return a user", func() {
			var response map[string]models.Usuario
			json.Unmarshal(resp.Body.Bytes(), &response)
			So(response["data"].ID, ShouldEqual, 1)
		})
	})
}

func TestCreateUser(t *testing.T) {
	router := setupRouter()
	router.POST("/users", CreateUser)

	Convey("POST /users", t, func() {
		usuario := models.Usuario{
			Dni:              "99999989",
			Nombres:          "Tester",
			Apellido_paterno: "User",
			Apellido_materno: "Test",
			Email:            "testeruser@example.com",
			Password:         "password",
			Rol:              "normal",
			FechaNacimiento:  "2000-01-01",
			Habilitado:       true,
		}
		userJson, _ := json.Marshal(usuario)
		req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(userJson))
		req.Header.Set("Content-Type", "application/json")
		resp := httptest.NewRecorder()
		router.ServeHTTP(resp, req)

		Convey("Should return status 201", func() {
			So(resp.Code, ShouldEqual, 201)
		})

		Convey("Should return the created user", func() {
			var response map[string]models.Usuario
			json.Unmarshal(resp.Body.Bytes(), &response)
			So(response["data"].Email, ShouldEqual, usuario.Email)
		})
	})
}

func TestUpdateUser(t *testing.T) {
	router := setupRouter()
	router.PUT("/users/:id", UpdateUser)

	Convey("PUT /users/:id", t, func() {
		updatedUser := models.Usuario{
			Nombres:          "Updated",
			Apellido_paterno: "User",
			Apellido_materno: "Updated",
			Email:            "updateduser@example.com",
			Password:         "newpassword",
			Rol:              "admin",
			FechaNacimiento:  "1990-01-01",
			Habilitado:       false,
		}
		userJson, _ := json.Marshal(updatedUser)
		req, _ := http.NewRequest("PUT", "/users/1", bytes.NewBuffer(userJson))
		req.Header.Set("Content-Type", "application/json")
		resp := httptest.NewRecorder()
		router.ServeHTTP(resp, req)

		Convey("Should return status 200", func() {
			So(resp.Code, ShouldEqual, 200)
		})

		Convey("Should return the updated user", func() {
			var response map[string]models.Usuario
			json.Unmarshal(resp.Body.Bytes(), &response)
			So(response["data"].Email, ShouldEqual, updatedUser.Email)
		})
	})
}

func TestDeleteUser(t *testing.T) {
	router := setupRouter()
	router.DELETE("/users/:id", DeleteUser)

	Convey("DELETE /users/:id", t, func() {
		req, _ := http.NewRequest("DELETE", "/users/1", nil)
		resp := httptest.NewRecorder()
		router.ServeHTTP(resp, req)

		Convey("Should return status 200", func() {
			So(resp.Code, ShouldEqual, 200)
		})

		Convey("Should return true", func() {
			var response map[string]bool
			json.Unmarshal(resp.Body.Bytes(), &response)
			So(response["data"], ShouldBeTrue)
		})
	})
}
