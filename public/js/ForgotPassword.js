document.getElementById('recover-form').addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

            const emailInput = document.getElementById('recover-email');
            const email = emailInput.value.trim();
            const messageDiv = document.getElementById('form-message');

            // Limpiar mensajes previos

            messageDiv.textContent = '';
            messageDiv.className = 'message';
            messageDiv.style.display = 'none';

            // Validación de correo electrónico

            if (email === '' || !email.includes('@')) {
                messageDiv.textContent = 'Por favor, ingresa un correo electrónico válido.';
                messageDiv.classList.add('error');
                messageDiv.style.display = 'block';
                return;
            }

            // Aquí es donde se enviaria el correo electrónico al servidor.
        
            console.log('Solicitud de recuperación de contraseña para:', email);
            messageDiv.textContent = 'Si el correo electrónico existe en nuestros registros, recibirás un enlace de recuperación en breve.';
            messageDiv.classList.add('success');
            messageDiv.style.display = 'block';

            //Se deshabilita el formulario después de enviar para evitar envíos duplicados
            
             document.getElementById('recover-form').querySelector('button').disabled = true;
             emailInput.disabled = true;
            
            fetch('/api/recover-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageDiv.textContent = 'Si el correo electrónico existe en nuestros registros, recibirás un enlace de recuperación en breve.';
                    messageDiv.classList.add('success');
                } else {
                    messageDiv.textContent = data.message || 'Ocurrió un error al procesar tu solicitud.';
                    messageDiv.classList.add('error');
                }
                messageDiv.style.display = 'block';
            })
            .catch(error => {
                console.error('Error:', error);
                messageDiv.textContent = 'Error de conexión con el servidor. Inténtalo de nuevo más tarde.';
                messageDiv.classList.add('error');
                messageDiv.style.display = 'block';
            });
            
        });