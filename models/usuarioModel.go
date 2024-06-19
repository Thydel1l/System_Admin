package models

import (
	"gorm.io/gorm"
)

type Usuario struct {
	gorm.Model
	Dni              string `gorm:"unique;not null;type:varchar(8)"`
	Nombres          string `gorm:"not null;type:varchar(50)"`
	Apellido_paterno string `gorm:"not null;type:varchar(30)"`
	Apellido_materno string `gorm:"not null;type:varchar(30)"`
	Email            string `gorm:"not null;type:varchar(50)"`
	Password         string `gorm:"not null; type:varchar(100)"`
	Rol              string `gorm:"not null; type:enum('admin','normal')"`
	FechaNacimiento  string `gorm:"not null; type:date"`
	Habilitado       bool   `gorm:"not null; type:boolean; default:true"`
}
