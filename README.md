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

7. venue-component.js
Este archivo JavaScript define componentes web reutilizables para la página de lugares. Crea el componente <venue-header> para mostrar el nombre, precio e información del lugar, y el componente <venue-video> para reproducir un video de fondo. Ambos componentes utilizan HTML, CSS y SVG definidos directamente en el JavaScript para crear una experiencia visual consistente y modular.

8. venue-filter.js
Este archivo JavaScript implementa la funcionalidad de filtrado y búsqueda en la página de lugares. Permite filtrar los lugares por capacidad, precio y servicios adicionales, y también buscar por nombre. Los resultados se actualizan dinámicamente en la página sin necesidad de recargarla.

/assets

Explicar brevemente qué contiene cada carpeta.

🚀 8. Instalación y Ejecución

Explicar cómo correr el proyecto.
