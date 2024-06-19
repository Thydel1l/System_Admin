package models

import (
	"gorm.io/gorm"
)

type ArchivoAdjunto struct {
	gorm.Model
	NombreArchivo string `gorm:"not null;type:varchar(255)"`
	TipoArchivo   string `gorm:"not null;type:varchar(50)"`
	RutaArchivo   string `gorm:"not null;type:varchar(255)"`
	IDTarea       uint   `gorm:"not null"`
	Tarea         Tarea  `gorm:"foreignKey:IDTarea"`
}
