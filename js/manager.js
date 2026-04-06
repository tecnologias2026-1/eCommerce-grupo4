// Función para cargar componentes
function cargarComponente(id, url) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar: " + url);
            return response.text();
        })
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error(error));
}

// Llamada a las funciones
document.addEventListener("DOMContentLoaded", () => {
    cargarComponente('header-placeholder', 'header.html');
    cargarComponente('footer-placeholder', 'footer.html');
});