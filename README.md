# 💍 Albert & Yuly — Invitación digital de boda

Aplicación web premium para invitar, confirmar asistencia (RSVP) y administrar
invitados. Cada persona recibe un **enlace único** por WhatsApp que la identifica
automáticamente — sin formularios, sin escribir el nombre.

Estética inspirada en el **Salar de Uyuni** (horizonte infinito, sal, atardecer).

**26 de septiembre de 2026**

---

## ✨ Características

- **Invitación por token** — `/i/<token>`: la página ya sabe quién es el invitado.
- **Portada con parallax**, cuenta regresiva en vivo, historia con timeline,
  galería con lightbox, ceremonia y recepción con Google Maps, código de
  vestimenta, regalos (Nequi / transferencia / lluvia de sobres).
- **RSVP** con validación de cupos, restricciones alimenticias y mensaje.
- **Panel `/admin`** protegido: estadísticas, tabla filtrable, importar/exportar
  Excel, envío por WhatsApp con un clic y marcado de invitaciones enviadas.
- **Álbum colaborativo** post-evento — cada invitado sube sus fotos.
- **PWA instalable**, SEO/Open Graph, dark mode en el panel, animaciones con
  Framer Motion y accesibilidad (respeta *reduce motion*).
- **Modo demo**: funciona sin base de datos con invitados de ejemplo.

## 🧱 Stack

Next.js 15 (App Router) · React 19 · TypeScript · TailwindCSS · Framer Motion ·
Supabase (DB + Storage) · React Hook Form + Zod · TanStack Query · Lucide ·
`xlsx` · desplegable en Vercel.

---

## 🚀 Puesta en marcha (local)

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>. Sin configurar Supabase arranca en **modo demo**:

- Invitación de ejemplo: <http://localhost:3000/i/demo-carlos>
- Panel: <http://localhost:3000/admin> (contraseña por defecto: `boda2026`)

---

## 🗄️ Conectar Supabase (producción)

1. Crea un proyecto en <https://supabase.com>.
2. En **SQL Editor**, ejecuta [`supabase/schema.sql`](supabase/schema.sql)
   (y opcionalmente [`supabase/seed.sql`](supabase/seed.sql) para datos de prueba).
3. Copia `.env.example` a `.env.local` y completa:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ADMIN_PASSWORD=una-clave-fuerte
   ADMIN_SESSION_SECRET=cadena-larga-aleatoria
   NEXT_PUBLIC_SITE_URL=https://boda.albertyuly.com
   NEXT_PUBLIC_DEMO_MODE=false
   ```

> **Seguridad:** la tabla `guests` tiene RLS activo y **sin políticas para anon**,
> así que solo el servidor (con la *service role*) puede leerla/escribirla. La
> `SUPABASE_SERVICE_ROLE_KEY` nunca se expone al navegador.

### Importar invitados

En `/admin` → **Importar Excel**. Encabezados aceptados (español o inglés):

| nombre | telefono | email | grupo | cupos |
|--------|----------|-------|-------|-------|

- `grupo`: `familia`, `amigos`, `trabajo` u `otros`.
- `cupos`: total de pases (incluye al invitado).
- Se genera un **token único** por invitado automáticamente.

Ejemplo listo para probar: [`data/invitados-ejemplo.csv`](data/invitados-ejemplo.csv).

---

## 📤 Envío por WhatsApp

Desde la tabla del panel, el botón **WhatsApp** abre el chat con el mensaje ya
escrito (`wa.me`) y marca la invitación como *enviada*. El botón **Copiar**
copia el enlace único del invitado.

---

## ☁️ Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en <https://vercel.com> (framework Next.js, sin config extra).
3. En **Settings → Environment Variables**, añade las mismas variables de
   `.env.local` (con `NEXT_PUBLIC_DEMO_MODE=false`).
4. Deploy. Configura el dominio `boda.albertyuly.com` en **Settings → Domains**.

```bash
npm run build   # verifica el build de producción
npm run typecheck
```

---

## 🛠️ Personalización

Todos los datos del evento están en **[`src/lib/config.ts`](src/lib/config.ts)**:
novios, fecha, lugares, mapas, regalos, historia, galería, fecha límite de RSVP.
Las fotos están en `public/photos/`.

## 📁 Estructura

```
src/
├─ app/
│  ├─ i/[token]/        → invitación pública personalizada
│  ├─ album/[token]/    → álbum colaborativo
│  ├─ admin/            → panel (login + dashboard)
│  └─ actions/          → Server Actions (rsvp, admin, album)
├─ components/
│  ├─ invitation/       → secciones de la invitación
│  ├─ admin/            → dashboard y tabla
│  └─ ui/               → primitivos (shadcn-style)
└─ lib/                 → config, tipos, datos, Supabase, auth
```

Hecho con ❤️ para Albert & Yuly.
