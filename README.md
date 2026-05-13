# FinanzApp — Gestor de Finanzas Personales

Aplicación web para gestionar ingresos, gastos y presupuestos personales.
Desarrollada con el stack MERN (MongoDB, Express.js, React.js, Node.js).

## Aplicación en producción

- **Frontend:** https://gestor-finanzas-three.vercel.app
- **Backend:** https://gestor-finanzas-dixv.onrender.com

---

## Requisitos previos

- Node.js v18 o superior
- Cuenta en MongoDB Atlas (gratuita)
- Git

---

## Instalación en local

### 1. Clonar el repositorio

```bash
git clone https://github.com/albamndz/GESTOR_FINANZAS
cd GESTOR_FINANZAS
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear el archivo `.env` dentro de la carpeta `backend` copiando el archivo `.env.example`:

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus propios valores:

```
PORT=5000
MONGO_URI=mongodb+srv://TU_USUARIO:TU_CONTRASEÑA@cluster0.mongodb.net/gestorfinanzas
JWT_SECRET=tu_clave_secreta
```

Arrancar el backend:

```bash
node src/index.js
```

El servidor estará disponible en `http://localhost:5000`

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

Editar el archivo `src/services/api.js` y cambiar la `baseURL` a:

```javascript
baseURL: 'http://localhost:5000/api'
```

Arrancar el frontend:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

---

## Archivo de configuración global

El archivo de configuración principal del backend es `backend/.env`.
Contiene todas las variables necesarias para ejecutar la aplicación:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto donde corre el servidor (por defecto 5000) |
| `MONGO_URI` | Cadena de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT |

---

## Credenciales de prueba

Para probar la aplicación puedes registrarte con cualquier correo y contraseña desde la pantalla de registro.

Para acceder como administrador contactar con la autora.

---

## Estructura del proyecto

```
GESTOR_FINANZAS/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

---

## Tecnologías utilizadas

- **Frontend:** React.js, Tailwind CSS, Chart.js, Axios
- **Backend:** Node.js, Express.js, JWT, bcrypt
- **Base de datos:** MongoDB Atlas
- **Despliegue:** Vercel (frontend) + Render (backend)
- **Control de versiones:** Git + GitHub

---

## Autora

Alba Bragado Menéndez — 2º DAW — CIFP Avilés
