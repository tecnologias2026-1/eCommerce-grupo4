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
/js
/assets

Explicar brevemente qué contiene cada carpeta.

🚀 8. Instalación y Ejecución

Explicar cómo correr el proyecto.
