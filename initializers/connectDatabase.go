package initializers

import (
	"fmt"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func craftDSNs() (string, string, error) {
	dbName := os.Getenv("DB_NAME")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")

	if dbName == "" || dbUser == "" || dbPassword == "" || dbHost == "" || dbPort == "" {
		return "", "", fmt.Errorf("missing required environment variables")
	}

	connection := fmt.Sprintf("%s:%s@tcp(%s:%s)/", dbUser, dbPassword, dbHost, dbPort)
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", dbUser, dbPassword, dbHost, dbPort, dbName)

	return connection, dsn, nil
}

func ConnectToDB() error {
	// Obtener cadenas de conexión desde las variables de entorno
	connection, dsn, err := craftDSNs()
	if err != nil {
		return fmt.Errorf("error al construir cadenas de conexión: %w", err)
	}

	// Conectar a MySQL
	db, err := gorm.Open(mysql.Open(connection), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("error al abrir la conexión a MySQL: %w", err)
	}

	// Crear la base de datos si no existe
	createDatabaseCommand := "CREATE DATABASE IF NOT EXISTS " + os.Getenv("DB_NAME") + ";"
	if err := db.Exec(createDatabaseCommand).Error; err != nil {
		return fmt.Errorf("error al crear la base de datos: %w", err)
	}

	// Cerrar la conexión actual a MySQL antes de abrir la conexión a la base de datos específica
	if db != nil {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}

	// Conectar a la base de datos especificada
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("error al conectar a la base de datos: %w", err)
	}

	// Asignar la instancia de DB para usarla globalmente
	DB = db

	return nil
}
