package models

import (
	"gorm.io/gorm"
)

type Proyecto struct {
	gorm.Model
	Nombre      string  `gorm:"not null;type:varchar(255)"`
	Descripcion string  `gorm:"type:text"`
	FechaInicio string  `gorm:"not null;type:date"`
	FechaFin    string  `gorm:"not null;type:date"`
	IDUsuario   uint    `gorm:"not null"`
	Usuario     Usuario `gorm:"foreignKey:IDUsuario;references:ID"`
}
