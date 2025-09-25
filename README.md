# 📈 Stock Simulator - Simulador de Bolsa de Valores

Un simulador completo de bolsa de valores desarrollado con React, TypeScript, Node.js y Supabase. Esta aplicación permite explorar datos ficticios de mercados financieros, tipos de cambio, y acciones de diferentes bolsas de valores.

## 🚀 Características Principales

- **Dashboard Interactivo**: Vista general de todos los mercados con resúmenes rápidos
- **4 Secciones de Mercado**:
  - 💱 **Tipos de Cambio**: Pares de divisas principales (USD/MXN, EUR/USD, etc.)
  - 📊 **Acciones Generales**: Principales acciones del mercado
  - 💻 **NASDAQ 500**: Empresas tecnológicas destacadas
  - 🇲🇽 **BMV**: Bolsa Mexicana de Valores
- **Gráficos Interactivos**: Visualización de precios históricos con Recharts
- **Autenticación Completa**: Sistema de login/registro con Supabase
- **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- **Datos Ficticios**: Generación automática de datos realistas para aprendizaje

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Zustand** para manejo de estado
- **Recharts** para gráficos
- **Supabase** para autenticación

### Backend
- **Node.js** con Express
- **CORS** habilitado
- **Datos JSON** predefinidos y generados dinámicamente

### Base de Datos
- **Supabase** (solo para autenticación de usuarios)

## 📁 Estructura del Proyecto

```
stock-simulator/
├── backend/
│   ├── data/
│   │   └── mockData.js          # Datos ficticios generados
│   ├── package.json
│   ├── config.js                # Configuración del servidor
│   └── server.js                # Servidor Express
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   ├── pages/               # Páginas principales
│   │   ├── store/               # Store de Zustand
│   │   ├── types/               # Tipos TypeScript
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── package.json                 # Scripts principales
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Cuenta de Supabase (para autenticación)

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd stock-simulator
```

### 2. Instalar Dependencias
```bash
# Instalar todas las dependencias (raíz, backend y frontend)
npm run install-all

# O instalar manualmente:
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configurar Supabase (Opcional)

Si deseas usar autenticación real, configura Supabase:

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Obtén tu URL y clave anónima
3. Actualiza el archivo `frontend/src/store/authStore.ts`:

```typescript
const supabaseUrl = 'tu-url-de-supabase';
const supabaseKey = 'tu-clave-anonima';
```

**Nota**: Para desarrollo, puedes usar valores ficticios ya que la autenticación es simulada.

### 4. Iniciar la Aplicación

#### Opción 1: Iniciar todo junto (Recomendado)
```bash
npm run dev
```

#### Opción 2: Iniciar por separado
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run frontend
```

### 5. Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📊 API Endpoints

El backend expone los siguientes endpoints:

- `GET /api/data` - Todos los datos del mercado
- `GET /api/exchange-rates` - Tipos de cambio
- `GET /api/market-stocks` - Acciones generales
- `GET /api/nasdaq500` - NASDAQ 500
- `GET /api/bmv` - Bolsa Mexicana de Valores
- `GET /api/stock/:ticker` - Acción específica por ticker
- `GET /api/health` - Estado del servidor

## 🎯 Funcionalidades

### Dashboard Principal
- Resumen de las 4 secciones principales
- Estadísticas generales del mercado
- Navegación rápida a cada sección

### Tipos de Cambio
- Pares de divisas principales
- Tasas actuales, apertura, cierre, máximo y mínimo
- Volumen de operaciones
- Variación porcentual

### Acciones
- Información detallada de cada acción
- Precios, capitalización de mercado, P/E ratio
- Volumen de operaciones
- Historial de precios para gráficos

### Gráficos Interactivos
- Visualización de precios históricos (30 días)
- Dos tipos de gráficos: línea y área
- Tooltips informativos
- Colores dinámicos según tendencia

### Autenticación
- Registro de nuevos usuarios
- Inicio de sesión
- Protección de rutas
- Manejo de sesiones

## 🎨 Diseño y UX

- **Diseño Moderno**: Interfaz limpia y profesional
- **Totalmente Responsivo**: Optimizado para todos los dispositivos
- **Animaciones Suaves**: Transiciones y efectos visuales
- **Colores Intuitivos**: Verde para ganancias, rojo para pérdidas
- **Navegación Intuitiva**: Header fijo con navegación clara

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Layout completo con sidebar y múltiples columnas
- **Tablet**: Adaptación de grids y navegación
- **Móvil**: Navegación colapsable y layout vertical

## 🔧 Personalización

### Agregar Nuevas Acciones
Edita `backend/data/mockData.js` y agrega nuevas acciones al array correspondiente:

```javascript
const newStock = generateStock('NUEVO', 'Nueva Empresa', 100.00, 1000000000);
marketStocks.push(newStock);
```

### Modificar Datos de Tipos de Cambio
Actualiza el array `exchangeRates` en el mismo archivo:

```javascript
const newRate = {
  id: 6,
  pair: 'BTC/USD',
  name: 'Bitcoin / Dólar Americano',
  currentRate: 45000.00,
  // ... más propiedades
};
```

### Personalizar Colores
Modifica `frontend/tailwind.config.js` para cambiar la paleta de colores:

```javascript
colors: {
  primary: {
    500: '#tu-color-primario',
    // ...
  }
}
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia backend y frontend
npm run backend          # Solo backend
npm run frontend         # Solo frontend

# Instalación
npm run install-all      # Instala todas las dependencias

# Producción
npm run build            # Construye el frontend para producción
```

## 🐛 Solución de Problemas

### Error de CORS
Si encuentras errores de CORS, asegúrate de que el backend esté ejecutándose en el puerto 3001.

### Error de Supabase
Si no configuraste Supabase, puedes usar cualquier email y contraseña para el login (la validación es simulada).

### Puerto en Uso
Si el puerto 3000 o 3001 está en uso, puedes cambiarlo:
- Backend: Modifica `backend/config.js`
- Frontend: Crea un archivo `.env` en `frontend/` con `PORT=3002`

## 📚 Aprendizaje y Educación

Este simulador está diseñado para:
- **Estudiantes**: Aprender sobre mercados financieros
- **Desarrolladores**: Ver ejemplos de aplicaciones full-stack
- **Inversionistas**: Entender interfaces de trading (sin riesgo)

## ⚠️ Advertencia Importante

**Los datos mostrados son completamente ficticios y se generan automáticamente. Esta aplicación es únicamente para fines educativos y de aprendizaje. No debe utilizarse para tomar decisiones de inversión reales.**

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o problemas:
1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles específicos

---

**¡Disfruta explorando los mercados financieros con este simulador educativo! 📈**
