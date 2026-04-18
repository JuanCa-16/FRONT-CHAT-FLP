# FRONT-CHAT-FLP

Aplicación web de chat educativo desarrollada con React, TypeScript y Vite. Permite a los estudiantes interactuar con un asistente inteligente, acceder a recursos del curso (PDFs, videos, documentación GitHub) y recibir recomendaciones personalizadas.

## Estructura de Carpetas

```
├── public/
│   ├── corpus.json
│   └── PDFS_DIAPOSITIVAS_CAMPUS/
├── src/
│   ├── App.tsx
│   ├── constants.ts
│   ├── custos.d.ts
│   ├── index.css
│   ├── interfaces.ts
│   ├── main.tsx
│   ├── assets/
│   ├── components/
│   │   ├── Icons.tsx
│   │   ├── Portal.tsx
│   │   ├── TypingIndicator.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── Btns/
│   │   ├── Inputs/
│   │   ├── Menu/
│   │   ├── SideBar/
│   │   └── TopBar/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   └── services/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── ...
```

## Páginas Principales

- **/chat**: Página principal de chat con el asistente. Permite enviar mensajes, ver respuestas, historial y calificar respuestas.
- **/pdfs**: Acceso a PDFs del curso organizados por tema.
- **/videos**: Visualización de videos educativos del curso.
- **/git**: Documentación y ejemplos de GitHub relacionados al curso.
- **/recomendaciones**: Recomendaciones personalizadas basadas en el uso y preferencias del usuario.
- **/login**: Autenticación de usuario (login y registro).

## Componentes Destacados

- **SideBar**: Barra lateral con navegación y chats recientes.
- **TopBar**: Barra superior con selección de modelo, tema y página.
- **InputChat**: Entrada de texto para enviar mensajes en el chat.
- **Message**: Renderiza mensajes del chat, soporta markdown, código y enlaces a recursos.
- **TypingIndicator**: Indicador visual de "escribiendo...".
- **Menu/MenuOption**: Menú para seleccionar modelo de IA o tema visual.
- **VideoPlayer**: Reproductor de videos de YouTube integrados.
- **Tag/TagSelector**: Etiquetas para filtrar y seleccionar opciones.

## Servicios

- **api.ts**: Configuración base de Axios para peticiones HTTP.
- **authService.ts**: Lógica de autenticación (login, registro, token).
- **chatService.ts**: Gestión de chats y mensajes con el backend.
- **bibliotecaService.ts**: Manejo de recursos PDF y videos guardados.
- **recomendacion.ts**: Obtención de recomendaciones personalizadas.

## Tecnologías

- React 19 + TypeScript
- Vite
- React Router DOM
- Axios
- Sass (SCSS)
- react-hook-form, react-hot-toast, react-markdown, mermaid

## Scripts

- `npm run dev` — Inicia el servidor de desarrollo
- `npm run build` — Compila la aplicación para producción
- `npm run preview` — Previsualiza la build
- `npm run lint` — Linter de código
