# 🎓 Mr. Ellis — English Teacher App

## Pasos para publicar en Vercel

---

### 1. Instala lo necesario (solo la primera vez)

- Descarga e instala **Node.js**: https://nodejs.org (elige la versión LTS)
- Crea una cuenta gratis en **GitHub**: https://github.com
- Crea una cuenta gratis en **Vercel**: https://vercel.com

---

### 2. Prepara el proyecto

Abre una terminal (en Windows: busca "PowerShell" o "CMD") y escribe:

```bash
cd mr-ellis
npm install
```

---

### 3. Súbelo a GitHub

1. Ve a https://github.com/new
2. Crea un repositorio llamado `mr-ellis`
3. Sigue ahora las instrucciones que te da GitHub para subir los archivos

---

### 4. Despliega en Vercel

1. Ve a https://vercel.com y haz login
2. Haz clic en **"Add New Project"**
3. Importa tu repositorio `mr-ellis` de GitHub
4. Antes de hacer deploy, agrega tu **API Key de Anthropic**:
   - En Vercel, ve a **Settings → Environment Variables**
   - Agrega una variable:
     - **Name:** `ANTHROPIC_API_KEY`
     - **Value:** tu API key (la encuentras en https://console.anthropic.com)
5. Haz clic en **Deploy** ✅

---

### 5. ¡Listo!

Vercel te dará un link como `mr-ellis.vercel.app` que funciona en cualquier dispositivo.

Para instalarlo como app en el celular:
- **Android**: abre el link en Chrome → menú (⋮) → "Agregar a pantalla de inicio"
- **iPhone**: abre en Safari → botón compartir → "Agregar a pantalla de inicio"

---

## ¿Dónde consigo la API Key de Anthropic?

1. Ve a https://console.anthropic.com
2. Regístrate o inicia sesión
3. Ve a **API Keys** → **Create Key**
4. Copia esa key y pégala en Vercel como se explicó arriba

> ⚠️ La API key tiene un costo por uso. Anthropic ofrece créditos gratis al registrarse.
