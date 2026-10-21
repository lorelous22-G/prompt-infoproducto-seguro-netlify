# Activación del portal privado

La aplicación ya contiene la biblioteca, los cuatro lectores online, el login y el receptor de webhooks. Los PDF no se suben a GitHub: se guardan en Netlify Blobs, fuera del repositorio público.

1. En **Project configuration → General → Visitor access**, mantené **Production visibility: Public**. La portada debe seguir pública para que Hotmart y las personas puedan verla.
2. En **Project configuration → Identity**, activá Identity y elegí **Open** mientras probamos. Luego se puede cambiar a **Invite only**.
3. En **Identity → External providers**, activá Google si querés acceso con Google. El login por email ya queda disponible.
4. En **Environment variables**, creá:
   - `HOTMART_HOTTOK`: el token Hottok de Hotmart.
   - `HOTMART_PRODUCT_ID`: `8774493`.
   - `EBOOK_UPLOAD_TOKEN`: una clave aleatoria larga, usada una sola vez para cargar los cuatro PDF privados.
5. En Hotmart Developers → Webhooks, registrá esta URL: `https://prismatic-manatee-bd167b.netlify.app/.netlify/functions/hotmart-webhook`.
   Seleccioná como mínimo: `PURCHASE_APPROVED`, `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK` y `PURCHASE_CANCELED`.
6. En Hotmart, cambiá la URL posterior a compra por `https://prismatic-manatee-bd167b.netlify.app/login.html`.

El webhook, y no la redirección, concede o revoca el rol `buyer`. La redirección solo muestra la pantalla de acceso.

## Carga privada de los PDF

Con el sitio publicado y `EBOOK_UPLOAD_TOKEN` guardado, se cargan los cuatro archivos por `PUT` a `/.netlify/functions/upload-ebook?book=rituales`, `preparacion`, `cartas` y `terapeutica`, enviando el token en el encabezado `x-ebook-upload-token`. La función solo acepta esos cuatro nombres y guarda los bytes en el almacén privado `ritos-library`.

## Prueba antes de vender

Usá un correo comprador de prueba y un correo de control. Comprobá: acceso denegado sin sesión, compra aprobada → webhook, login comprador → portal, logout → bloqueo, y login del correo de control → bloqueo.

## Límite real

El rol evita que Netlify entregue los PDF a alguien sin permiso. Un comprador que ya recibió un PDF puede copiarlo o compartirlo; ningún portal web puede impedir eso por completo.
