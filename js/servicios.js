// Script para capturar solicitud de servicios y llenar el formulario
document.addEventListener('DOMContentLoaded', function() {
  
  // Obtener todos los botones "Solicitar Ahora"
  const botonesServicios = document.querySelectorAll('.servicio-boton');
  const botonesPromos = document.querySelectorAll('.promo_boton');

  // Función para capturar el nombre del servicio/promo
  function agregarEventoBoton(boton, esPromo = false) {
    boton.addEventListener('click', function(e) {
      e.preventDefault();
      
      let nombreServicio = '';

      if (esPromo) {
        // Para promos: obtener el título de la promo
        const promoCard = this.closest('.promo_card');
        const titulo = promoCard.querySelector('.promo_titulo_card');
        nombreServicio = titulo ? titulo.textContent.trim() : 'Promo solicitada';
      } else {
        // Para servicios: obtener el título del servicio
        const servicioCard = this.closest('.servicio-card');
        const titulo = servicioCard.querySelector('.servicio-titulo');
        nombreServicio = titulo ? titulo.textContent.trim() : 'Servicio solicitado';
      }

      // Llenar el campo del formulario
      const campoServicio = document.getElementById('servicio_solicitado');
      const campoProblema = document.getElementById('tipo_falla');
      
      if (campoServicio) {
        campoServicio.value = nombreServicio;
      }

      // Actualizar el textarea de problema si está vacío
      if (campoProblema && !campoProblema.value) {
        campoProblema.placeholder = `Cuéntanos más sobre tu solicitud de: ${nombreServicio}`;
      }

      // Desplazar al formulario
      const formulario = document.getElementById('formulario_fondo');
      if (formulario) {
        formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Enfocar el primer campo vacío
        const nombreInput = document.getElementById('nombre_contacto');
        if (nombreInput) {
          setTimeout(() => nombreInput.focus(), 500);
        }
      }
    });
  }

  // Agregar eventos a botones de servicios
  botonesServicios.forEach(boton => agregarEventoBoton(boton, false));

  // Agregar eventos a botones de promos
  botonesPromos.forEach(boton => agregarEventoBoton(boton, true));

  // Validar formulario antes de enviar
  const formulario = document.getElementById('formulario_contacto');
  if (formulario) {
    formulario.addEventListener('submit', function(e) {
      const servicioSolicitado = document.getElementById('servicio_solicitado');
      if (servicioSolicitado && !servicioSolicitado.value) {
        console.warn('Campo de servicio vacío, pero no es obligatorio');
      }
    });
  }
});
