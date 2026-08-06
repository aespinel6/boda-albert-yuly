-- Datos de ejemplo (opcional). Ejecuta después de schema.sql.
insert into public.guests (name, phone, "group", allowed_guests, adults, children, token, status, sent, companions, message, confirmed_at)
values
  ('Carlos Pérez', '573001112233', 'amigos', 2, 2, 0, 'demo-carlos', 'confirmed', true, 2, '¡Con gusto! Ahí estaremos 🎉', now()),
  ('María Gómez',  '573004445566', 'familia', 4, 3, 1, 'demo-maria',  'pending',   true, null, null, null),
  ('Andrés Ruiz',  '573007778899', 'trabajo', 1, 1, 0, 'demo-andres', 'declined',  true, 0, 'Lo siento, tengo un viaje esa fecha.', now()),
  ('Laura Díaz',   '573001234567', 'familia', 3, 2, 1, 'demo-laura',  'confirmed', true, 3, 'Vamos los 3 ❤️', now()),
  ('Jorge Salas',  '573009876543', 'amigos', 2, 2, 0, 'demo-jorge',  'pending',   false, null, null, null)
on conflict (token) do nothing;
