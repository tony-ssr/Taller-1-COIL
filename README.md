# Taller 1 COIL - Modelo de Gestión de Casos

Una aplicación web interactiva que presenta diferentes modelos de gestión de casos con un diseño moderno y responsivo.

## 🌟 Características

- **Diseño Responsivo**: Adaptable a todos los dispositivos (desktop, tablet, móvil)
- **Navegación Intuitiva**: Menú hamburguesa colapsable para dispositivos móviles
- **Animaciones Suaves**: Transiciones y efectos visuales atractivos
- **Modelos Interactivos**: Presentación de diferentes enfoques de gestión de casos
- **Interfaz Moderna**: Diseño limpio con gradientes y efectos visuales

## 📱 Modelos Incluidos

1. **Modelo de Gestión de Casos** - Enfoque tradicional de manejo de casos
2. **Modelo Psicosocial** - Integración de aspectos psicológicos y sociales
3. **Comparación** - Análisis comparativo entre diferentes modelos
4. **Enfoque Integrado** - Metodología holística de gestión

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con variables CSS, flexbox y grid
- **JavaScript ES6+**: Funcionalidad interactiva y navegación dinámica
- **SVG**: Iconografía vectorial escalable

## 📦 Estructura del Proyecto

```
Taller 1 COIL/
├── assets/
│   └── icons.svg          # Iconos SVG del proyecto
├── content/
│   └── Taller 1 COIL.txt  # Contenido del proyecto
├── css/
│   └── styles.css         # Estilos principales
├── js/
│   └── script.js          # Funcionalidad JavaScript
├── index.html             # Página principal
├── README.md              # Este archivo
└── LICENSE                # Licencia del proyecto
```

## 🛠️ Instalación y Uso

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/taller-1-coil.git
   cd taller-1-coil
   ```

2. **Servir localmente**:
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js (si tienes http-server instalado)
   npx http-server
   
   # Con PHP
   php -S localhost:8000
   ```

3. **Abrir en el navegador**:
   Visita `http://localhost:8000`

## 📱 Características Responsivas

- **Desktop (>768px)**: Navegación horizontal completa
- **Tablet (≤768px)**: Menú hamburguesa colapsable
- **Móvil (≤480px)**: Diseño optimizado para pantallas pequeñas
- **Móvil pequeño (≤360px)**: Ajustes adicionales para dispositivos compactos

## 🎨 Personalización

### Variables CSS
El proyecto utiliza variables CSS para facilitar la personalización:

```css
:root {
    --primary-color: #e91e63;
    --secondary-color: #9c27b0;
    --accent-color: #ff4081;
    --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* ... más variables */
}
```

### Modificar Colores
Cambia las variables en `css/styles.css` para personalizar la paleta de colores.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Inspirado en las mejores prácticas de diseño web moderno
- Iconos y elementos visuales optimizados para la experiencia del usuario
- Diseño responsivo siguiendo los principios de Mobile First

---

⭐ ¡No olvides dar una estrella al proyecto si te ha sido útil!