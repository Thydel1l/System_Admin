-- Borrar la base de datos existente
DROP DATABASE IF EXISTS administracionproyectos;

-- Crear la nueva base de datos
CREATE DATABASE administracionproyectos;

-- Seleccionar la nueva base de datos
USE administracionproyectos;

-- Crear la tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'normal')),
    edad INT,
    fechacreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla de proyectos
CREATE TABLE proyectos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fechainicio DATE NOT NULL,
    fechafin DATE NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Crear la tabla de tareas
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    plazofinalizacion INT NOT NULL,  -- Plazo en días
    fechacreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_proyecto INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Crear la tabla de archivos_adjuntos
CREATE TABLE archivos_adjuntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombrearchivo VARCHAR(255) NOT NULL,
    tipoarchivo VARCHAR(50) NOT NULL,
    rutaarchivo VARCHAR(255) NOT NULL,
    id_tarea INT NOT NULL,
    FOREIGN KEY (id_tarea) REFERENCES tareas(id)
);






import (
	"gorm.io/gorm"
)

type Asegurado struct {
	gorm.Model
	SeguroId         uint     `gorm:"not null"` //foreign key
	Seguro           Seguro   `gorm:"foreignKey:SeguroId"`
	DniAsegurado     string   `gorm:"not null; type:varchar(8)"`
	Paciente         Paciente `gorm:"foreignKey:DniAsegurado; references:Dni"` //foreign key
	FechaInscipcion  string   `gorm:"not null, default:CURRENT_TIMESTAMP; type:date"`
	FechaVencimiento string   `gorm:"not null; type:date"`
}

type Usuario struct {
	gorm.Model
	DniPaciente    *string   `gorm:"unique; type:varchar(8)"` // foreign key
	Paciente       *Paciente `gorm:"foreignkey:DniPaciente; references:Dni"`
	LicenciaDoctor *string   `gorm:"unique; type:varchar(20)"` // foreign key
	Doctor         *Doctor   `gorm:"foreignkey:LicenciaDoctor; references:NumeroLicencia"`
	Password       string    `gorm:"not null; type:varchar(100)"`
	Tipo           string    `gorm:"not null; type:enum('paciente','doctor','admin')"`
	Habilitado     bool      `gorm:"not null; type:boolean; default:true"`
}
type Paciente struct {
	gorm.Model
	Dni              string `gorm:"unique;not null;type:varchar(8)"`
	Nombres          string `gorm:"not null;type:varchar(50)"`
	Apellido_paterno string `gorm:"not null;type:varchar(30)"`
	Apellido_materno string `gorm:"not null;type:varchar(30)"`
	Genero           string `gorm:"not null;type:enum('masculino','femenino')"`
	Direccion        string `gorm:"type:varchar(100)"`
	Telefono         string `gorm:"not null;type:varchar(12)"`
	Ocupacion        string `gorm:"type:varchar(30)"`
	FechaNacimiento  string `gorm:"not null; type:date"`
}