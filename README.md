Para Completar por grupo

🌐 eCommerce de bodas - Eventos & Decoraciones

Escribe aquí una descripción corta del proyecto.

👥 Integrantes

Tatiana Castillo Nieto – 1202729
Laura Sofia Ayala Gil – 1202735
Dilan Garces Ortega - 1202651

🎯 1. Objetivo General

Desarrollar una plataforma eCommerce para la gestión de bodas que permita a los clientes seleccionar una hacienda, configurar servicios adicionales de manera personalizada, visualizar el costo total del evento en tiempo real y realizar la reserva mediante el pago de un adelanto porcentual, optimizando el proceso de planificación y contratación.

🌍 2. Contexto de Uso

Clientes para eventos sociales (bodas): Parejas que buscan una solución centralizada para seleccionar locaciones y servicios adicionales, con control sobre su presupuesto.

Administrador del sistema: Personal responsable de gestionar la plataforma, actualizar la oferta de haciendas, servicios, precios y supervisar las reservas y pagos.

Clientes para eventos sociales (bodas): Parejas que buscan una solución centralizada para seleccionar locaciones y servicios adicionales, con control sobre su presupuesto.

Administrador del sistema: Personal responsable de gestionar la plataforma, actualizar la oferta de haciendas, servicios, precios y supervisar las reservas y pagos.

📋 3. Requerimientos del Sistema

3.1 Requerimientos Funcionales
  RF01: El sistema debe permitir a los administradores iniciar sesión para la gestión de la plataforma.
  RF02: El sistema debe mostrar un catálogo organizado de haciendas con su información básica y precio base.
  RF03: El sistema debe permitir la consulta detallada de cada hacienda, incluyendo galería de imágenes y capacidad.
  RF04: El sistema debe permitir visualizar la disponibilidad de fechas mediante un calendario interactivo.
  RF05: El sistema debe permitir al usuario seleccionar y personalizar servicios adicionales.
  RF06: El sistema debe realizar una actualización dinámica del presupuesto total según los servicios seleccionados.
  RF07: El sistema debe mostrar un resumen detallado o "carrito" con la selección final del evento.
  RF08: El sistema debe calcular automáticamente el valor del adelanto requerido para la reserva.
  RF09: El sistema debe permitir el pago electrónico del adelanto a través de una pasarela de pagos.
  RF10: El sistema debe generar y enviar una confirmación automática de la reserva por correo electrónico.
  RF11: El sistema debe proveer herramientas al administrador para gestionar contenidos, precios y disponibilidad.

3.2 Requerimientos No Funcionales
  RNF01: El sistema debe ser responsive, adaptándose a dispositivos móviles, tabletas y computadoras de escritorio.
  RNF02: El tiempo de carga de las páginas principales no debe ser superior a 3 segundos.
  RNF03: El sistema debe utilizar el protocolo HTTPS y cifrado para proteger datos personales y financieros.
  RNF04: El sistema debe garantizar una disponibilidad del 99% del tiempo anual.
  RNF05: La interfaz debe ser intuitiva y fácil de usar (usabilidad).
  RNF06: El sistema debe ser escalable para permitir la incorporación futura de nuevos proveedores y servicios.

🧠 4. Diagramas UML

Diagrama de Casos de Uso

Este diagrama muestra el comportamiento del sistema desde la perspectiva del usuario, detallando las interacciones entre los actores (Cliente, Administrador y Sistema de Pagos) y las funcionalidades principales como la configuración de eventos y la gestión de reservas.

Diagrama de Secuencia

Representa la lógica cronológica del proceso "Calcular Presupuesto en Tiempo Real". Ilustra cómo la interfaz solicita precios al controlador, este consulta la base de datos y devuelve el valor actualizado al usuario de forma inmediata.


🎨 5. URL del Prototipo

Colocar aquí el enlace público de Figma:

https://www.figma.com/design/q2ANO5YdQzJSHlsPRZkADz/WIREFRAME-TEC?node-id=0-1&t=qXnHhzxFbmYZXsPC-1


🗄️ 6. Diseño de Base de Datos

<img width="1728" height="1168" alt="Diagramas" src="https://github.com/user-attachments/assets/df2bdc54-36e7-4687-96eb-d1521dcb5b11" />

Tablas principales:
USUARIO: Almacena los datos de acceso y perfil (id, nombre, email, password).
HACIENDA: Contiene la información de las locaciones (id, nombre, capacidad, precio_base).
SERVICIO: Registra los servicios adicionales disponibles (id, nombre, categoria, precio_unidad, medida_unidad).
RESERVA: Encabezado del pedido (id, fecha_evento, total, estado_pago).
DETALLE_RESERVA: Tabla intermedia que vincula reservas con múltiples servicios, registrando la cantidad y el precio al momento de la compra. (id_reserva, id_servicio, cantidad, precio_momento, subtotal_item).

🧩 7. Documentación del Sistema
Estructura de Carpetas

/css

1. Global CSS
El archivo de estilos globales contiene toda la configuración base y general de la página web. En esta sección se definen aspectos como la tipografía, colores principales, márgenes, paddings, variables globales (:root), estilos para botones, encabezados, navegación, contenedores y demás componentes principales.
Su objetivo es mantener una apariencia uniforme en todas las páginas del sitio y facilitar la reutilización de estilos.

2. Media CSS (Responsive Design)
Este archivo o sección está enfocado en la adaptabilidad de la página según el tamaño de la pantalla.
Se utilizan media queries para modificar la distribución, tamaños de texto, imágenes, columnas y botones dependiendo del dispositivo.

Se divide principalmente en:

Tablet (max-width: 1024px): ajustes para pantallas medianas.
Mobile (max-width: 768px): reorganización para celulares.
Extra small mobile (max-width: 480px): optimización para pantallas pequeñas.

Gracias a esto, la página puede visualizarse correctamente en computadores, tablets y teléfonos móviles.

3. Archivo .gitkeep
El archivo .gitkeep no corresponde a estilos visuales del proyecto.
Su función es permitir que Git y GitHub conserven carpetas vacías dentro del repositorio, ya que por defecto Git no guarda directorios sin contenido.
En este caso, puede encontrarse dentro de la carpeta css únicamente para asegurar que la carpeta exista en el repositorio, aunque no influye en el diseño ni en la funcionalidad de la página.

/js

1. auth-login.js
Este archivo JavaScript se encarga de gestionar el inicio de sesión del usuario.
Primero verifica si existe el formulario de autenticación en la página. Luego, al enviar el formulario, evita que la página se recargue automáticamente, valida que todos los campos estén completos y, si la información es correcta, redirige al usuario a la página de reservas (reservations.html).

2. auth.modal.js
Este archivo JavaScript controla la ventana modal de recuperación de contraseña.
Se encarga de abrir el modal cuando el usuario selecciona la opción “olvidé mi contraseña”, cerrarlo al presionar el botón de regreso y también permite cerrarlo al hacer clic fuera del contenido de la ventana emergente.

3. auth-password-toggle.js
Este archivo JavaScript permite mostrar y ocultar la contraseña en el campo de inicio de sesión.
Al hacer clic en el botón correspondiente, cambia el tipo de entrada entre texto visible y contraseña oculta, además de actualizar el estado visual del botón y su accesibilidad.

4. calendar.js
Este archivo JavaScript gestiona el calendario de selección de fechas para reservas.
Permite mostrar los días del mes, cambiar entre meses y años, seleccionar una fecha disponible, marcar fechas ocupadas, limpiar la selección y guardar la fecha elegida en el localStorage. Además, envía eventos para actualizar otras secciones del sistema según la fecha seleccionada.

5. cart.js
Este archivo JavaScript administra el carrito de la boda.
Se encarga de agregar y eliminar el lugar seleccionado, validar que exista una fecha elegida antes de reservar, guardar la información en localStorage y mostrar ventanas emergentes de alerta o confirmación para informar al usuario sobre acciones como agregar, eliminar o limpiar el carrito.

6. manager.js
Es el archivo principal encargado de gestionar el funcionamiento global del sitio web, ya que controla la navegación entre las diferentes páginas del proceso de reserva, identifica la página actual para resaltar el paso correspondiente en el menú, carga dinámicamente componentes reutilizables como el encabezado y el pie de página, corrige las rutas de los archivos CSS y enlaces internos, y administra el carrito de compra almacenado en `localStorage`. Además, se encarga de calcular y actualizar el precio total mostrado en el encabezado, mostrar ventanas emergentes como el resumen de la reserva, alertas y confirmaciones, y mantener sincronizada la información del flujo de la boda en todo el sistema.

7. venue-filter.js
Este archivo JavaScript implementa la funcionalidad de filtrado y búsqueda en la página de lugares. Permite filtrar los lugares por capacidad, precio y servicios adicionales, y también buscar por nombre. Los resultados se actualizan dinámicamente en la página sin necesidad de recargarla.

/assets

1. images
Almacena todos los recursos visuales utilizados en el sitio web, como fotografías, íconos, fondos, logos e imágenes decorativas que se muestran en las diferentes secciones de la página. Su función es centralizar los elementos gráficos para facilitar su organización y reutilización dentro del proyecto.

2. videos
Contiene los archivos de video que se utilizan en el sitio web, como videos de fondo, demostraciones de lugares, tutoriales o cualquier otro contenido audiovisual. Su función es centralizar los recursos de video para facilitar su organización y reutilización dentro del proyecto.

3. public
Contiene los archivos públicos del proyecto, como el index.html, el favicon.ico y el robots.txt. Su función es centralizar los archivos públicos para facilitar su organización y reutilización dentro del proyecto.


3.1 index.html
El archivo index.html es la página principal del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.2 auth.html
El archivo auth.html corresponde a la página de inicio de sesión del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.3 ceremony.html
El archivo ceremony.html corresponde a la página de ceremonias del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.4 confirm.html
El archivo confirm.html corresponde a la página de confirmación del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.5 food.html
El archivo food.html corresponde a la página de comida del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.6 footer.html
El archivo footer.html corresponde al pie de página del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.7 header.html
El archivo header.html corresponde al encabezado del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.8 others.html
El archivo others.html corresponde a la página de otros del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.9 payment.html
El archivo payment.html corresponde a la página de pago del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.10 place.html
El archivo place.html corresponde a la página de lugares del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.11 reception.html
El archivo reception.html corresponde a la página de recepción del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.12 reservations_view.html
El archivo reservations_view.html corresponde a la página de reservas del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.13 reservations.html
El archivo reservations.html corresponde a la página de reservas del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.14 reservcode.html
El archivo reservcode.html corresponde a la página de código de reservas del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.15 reserview_user.html
El archivo reserview_user.html corresponde a la página de vista de reservas del usuario del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.16 summary.html
El archivo summary.html corresponde a la página de resumen del sitio web. Contiene el formulario para que el usuario ingrese con correo o nombre de usuario y contraseña, además de incluir funciones como mostrar u ocultar la contraseña, recuperación mediante un modal y acceso a componentes globales como el encabezado y el pie de página. También enlaza los archivos CSS para el diseño visual y los scripts JavaScript que gestionan la autenticación y la interacción de la interfaz.

3.17 venues.html
Corresponde a la plantilla de las páginas de cada hacienda o venue disponible para la boda. En esta estructura se muestra la información detallada del lugar, como el encabezado con nombre, precio e invitados, ubicación con mapa, video de presentación, estimación dinámica del costo según el número de invitados guardado en `localStorage`, galería de características visuales e información descriptiva del espacio. Además, incluye la opción de agregar el venue al carrito y navegar entre diferentes haciendas. Esta misma plantilla se reutiliza en todos los venues del proyecto, cambiando únicamente la información, imágenes, videos, precios y descripciones específicas de cada lugar.

3.18 wedings.html
Corresponde a la plantilla de las páginas que muestran bodas ejemplares o de inspiración dentro del proyecto. En esta estructura se presenta la información principal de cada boda, como los nombres de la pareja, la fecha, el lugar donde se realizó, una imagen principal tipo banner y una galería de fotos con diferentes aspectos del evento, como la hacienda, la recepción, la comida y la decoración. Esta misma plantilla se reutiliza para todas las páginas de bodas de ejemplo, cambiando únicamente los nombres, fechas, ubicación e imágenes según cada caso.



🚀 8. Instalación y Ejecución

Para correr este proyecto de manera local, sigue estos pasos:

### 1. Clonar el repositorio
Si tienes Git instalado, puedes clonar el proyecto con el siguiente comando:
```bash
git clone https://github.com/tu-usuario/eCommerce-grupo4.git
```
O simplemente descarga el código como un archivo ZIP y extráelo en tu computadora.

### 2. Ejecutar un Servidor Local
Este proyecto utiliza `fetch` para cargar componentes dinámicos (como el encabezado y el pie de página). Por seguridad de los navegadores (CORS), **no se puede abrir el archivo `index.html` directamente haciendo doble clic**. Es necesario usar un servidor local.

Tienes varias opciones sencillas:

*   **Opción A: VS Code (Recomendado)**
    1. Abre la carpeta del proyecto en Visual Studio Code.
    2. Instala la extensión **"Live Server"**.
    3. Haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.

*   **Opción B: Python**
    Si tienes Python instalado, abre una terminal en la carpeta del proyecto y ejecuta:
    ```bash
    python -m http.server 8000
    ```
    Luego abre [http://localhost:8000](http://localhost:8000) en tu navegador.

*   **Opción C: Node.js (npx)**
    Si tienes Node.js instalado, ejecuta:
    ```bash
    npx serve .
    ```
    Luego abre el enlace que te proporcione la terminal.

### 3. ¡Listo!
Una vez que el servidor esté corriendo, podrás navegar por la plataforma, seleccionar haciendas, configurar servicios y ver el presupuesto en tiempo real.

📖 9. Guía de Navegación del Usuario

Sigue estos pasos para planificar tu boda en la plataforma:

1.  **Inicio y Autenticación:** 
    Al ingresar (vía `index.html` o `auth.html`), podrás iniciar sesión para gestionar tus preferencias (si eres administrador). Si solo quieres explorar como usuario, puedes navegar a las secciones de inspiración.

2.  **Selección de Fecha y Lugar:**
    *   Dirígete a la sección de **Haciendas** (Lugares).
    *   Utiliza el **Calendario Interactivo** para verificar la disponibilidad en la fecha que deseas tu evento.
    *   Filtra y selecciona la hacienda que más te guste. Haz clic en el botón para agregarla a tu plan de boda.

3.  **Configuración del Flujo de la Boda:**
    Una vez seleccionado el lugar, la plataforma te guiará automáticamente por los siguientes pasos (visibles en la barra de navegación superior):
    *   **Ceremonia:** Elige el tipo de altar y decoración.
    *   **Recepción:** Selecciona el mobiliario y estilo de la fiesta.
    *   **Comida:** Configura el menú y el número de invitados.
    *   **Otros:** Agrega servicios adicionales (música, fotografía, etc.).

4.  **Presupuesto en Tiempo Real:**
    En todo momento, verás en la parte superior derecha (en el encabezado) el **Total Acumulado**. Este valor se actualiza instantáneamente cada vez que agregas o quitas un servicio.

5.  **Resumen y Confirmación:**
    *   Haz clic en el icono del **Carrito/Total** para abrir el resumen detallado de tu selección.
    *   Verifica que todo esté correcto.
    *   Procede a la sección de **Pago** para realizar el adelanto y asegurar tu reserva.

6.  **Confirmación:**
    Tras el pago, el sistema te mostrará una pantalla de confirmación con el resumen final y tu código de reserva.


