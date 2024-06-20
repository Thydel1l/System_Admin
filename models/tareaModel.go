package models

import (
	"gorm.io/gorm"
)

type Tarea struct {
	gorm.Model
	Titulo            string   `gorm:"not null;type:varchar(255)"`
	Descripcion       string   `gorm:"type:text"`
	PlazoFinalizacion int      `gorm:"not null"`
	IDProyecto        uint     `gorm:"not null"`
	Proyecto          Proyecto `gorm:"foreignKey:IDProyecto;references:ID"`
}
