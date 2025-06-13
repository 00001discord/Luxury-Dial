
const MODO_SANDBOX = true; // Activar/desactivar modo ficticio (true para sandbox, false para llamadas reales)

// ** Credenciales de Andreani (REEMPLAZAR con tus credenciales reales para MODO_SANDBOX = false) **
const ANDREANI_USER = 'TU_USUARIO_ANDREANI';
const ANDREANI_PASSWORD = 'TU_CONTRASEÑA_ANDREANI';

const validateTrackingNumber = (trackingNumber) => {
    // Regex para números de seguimiento alfanuméricos entre 8 y 20 caracteres
    const regex = /^[a-zA-Z0-9]{8,20}$/; 
    return regex.test(trackingNumber) ? '' : 'El número de seguimiento debe ser alfanumérico y tener entre 8 y 20 caracteres.';
};

const validateContract = (contract) => {
    // Regex para contratos alfanuméricos con guiones bajos, entre 3 y 30 caracteres
    const regex = /^[a-zA-Z0-9_]{3,30}$/; 
    return regex.test(contract) ? '' : 'El contrato debe ser alfanumérico y tener entre 3 y 30 caracteres.';
};

const validateServiceType = (serviceType) => {
    // Regex para tipos de servicio con letras y espacios, entre 3 y 50 caracteres
    const regex = /^[a-zA-Z\s]{3,50}$/; 
    return regex.test(serviceType) ? '' : 'El tipo de servicio solo debe contener letras y espacios, y tener entre 3 y 50 caracteres.';
};

const validateClientBranchId = (clientBranchId) => {
    const num = parseInt(clientBranchId);
    if (isNaN(num) || num < 0) {
        return 'El ID de sucursal del cliente debe ser un número entero no negativo.';
    }
    return '';
};

const validatePostalCode = (postalCode) => {
    // Regex para códigos postales alfanuméricos con posibles espacios o guiones, entre 3 y 10 caracteres
    const regex = /^[a-zA-Z0-9\s-]{3,10}$/; 
    return regex.test(postalCode) ? '' : 'El código postal debe ser alfanumérico y tener entre 3 y 10 caracteres (puede incluir guiones o espacios).';
};


function showInputError(inputElement, message) {
    inputElement.classList.add('input-error'); // Añadir clase para borde rojo
    let errorSpan = inputElement.nextElementSibling; // Intenta encontrar un span de error existente

    // Si no existe o no es nuestro span de error, se crea
    if (!errorSpan || !errorSpan.classList.contains('input-specific-error')) {
        errorSpan = document.createElement('span');
        errorSpan.classList.add('input-specific-error', 'error'); // Usar clase 'error' para estilo
        // Insertar el span después del input
        inputElement.parentNode.insertBefore(errorSpan, inputElement.nextSibling);
    }
    errorSpan.textContent = message;
    errorSpan.classList.remove('hidden'); // Asegurarse de que sea visible
}


function clearInputError(inputElement) {
    inputElement.classList.remove('input-error'); // Eliminar clase de borde rojo
    const errorSpan = inputElement.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('input-specific-error')) {
        errorSpan.classList.add('hidden'); // Ocultar el mensaje
        errorSpan.textContent = ''; // Limpiar el texto
    }
}


async function getAndreaniToken(user, password) {
    if (MODO_SANDBOX) {
        console.log('🔐 Simulando obtención de token sandbox...');
        return 'TOKEN_FAKE_SANDBOX'; // Token ficticio para pruebas
    } else {
        console.log('🔐 Intentando obtener token real de Andreani...');
        const credentials = btoa(`${user}:${password}`);
        try {
            const response = await fetch('https://apissandbox.andreani.com/login', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al obtener el token real: ${response.status} ${response.statusText} - ${errorText}`);
            }
            return response.headers.get('x-authorization-token');
        } catch (error) {
            console.error('Error en getAndreaniToken (modo real):', error);
            return null;
        }
    }
}


async function createShipment(token, data) {
    if (MODO_SANDBOX) {
        console.log('🚚 Simulando creación de envío:', data);
        // Simulación de respuesta de la API de Andreani
        return {
            bultos: [{
                numeroDeEnvio: Math.floor(Math.random() * 1000000000000).toString().padStart(13, '0')
            }],
            mensaje: "Envío creado exitosamente."
        };
    } else {
        console.log('🚚 Intentando crear envío real con Andreani:', data);
        try {
            const response = await fetch(
                'https://apissandbox.andreani.com/beta/transporte-distribucion/oi', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            );
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear envío real: ${response.status} ${response.statusText} - ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error en createShipment (modo real):', error);
            throw error;
        }
    }
}


async function trackShipment(trackingNumber, token) {
    if (MODO_SANDBOX) {
        console.log('🔍 Simulando seguimiento de envío:', trackingNumber);
        // Simulación de respuesta de la API de Andreani
        const statuses = ['EN TRANSITO', 'EN SUCURSAL', 'ENTREGADO', 'EXCEPCION'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000); // Hasta 30 días atrás
        const estimatedDate = new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000); // Hasta 7 días en el futuro

        return {
            bultos: [{ numeroDeEnvio: trackingNumber }],
            estado: randomStatus,
            sucursalDeDistribucion: { descripcion: 'Sucursal ' + Math.floor(Math.random() * 10) },
            fechaCreacion: randomDate.toISOString().split('T')[0],
            fechaEstimadaDeEntrega: estimatedDate.toISOString().split('T')[0],
            historial: [{
                estado: randomStatus,
                fecha: new Date().toISOString()
            }]
        };
    } else {
        console.log('🔍 Intentando seguir envío real con Andreani:', trackingNumber);
        try {
            const response = await fetch(`https://apissandbox.andreani.com/v2/ordenes-de-envio/${trackingNumber}`, {
                method: 'GET',
                headers: {
                    'x-authorization-token': token,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Envío no encontrado o error en la solicitud real: ${response.status} ${response.statusText} - ${errorText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en trackShipment (modo real):', error);
            throw error;
        }
    }
}

// Event listener para el formulario de seguimiento

document.getElementById('tracking-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const trackingNumberInput = document.getElementById('tracking-number');
    const trackingNumber = trackingNumberInput.value.trim();
    const resultDiv = document.getElementById('result');
    const globalErrorMessage = document.getElementById('error-message');

    // Limpiar mensajes globales y específicos del input antes de validar o procesar
    globalErrorMessage.classList.add('hidden');
    clearInputError(trackingNumberInput);
    resultDiv.classList.add('hidden'); // Ocultar resultados previos

    // Validar el número de seguimiento
    const trackingError = validateTrackingNumber(trackingNumber);
    if (trackingError) {
        showInputError(trackingNumberInput, trackingError);
        return; // Detener la ejecución si hay un error de validación
    }

    // Mostrar mensaje de procesamiento
    globalErrorMessage.textContent = 'Procesando seguimiento...';
    globalErrorMessage.classList.remove('hidden', 'error');
    globalErrorMessage.classList.add('success');

    try {
        const token = await getAndreaniToken(ANDREANI_USER, ANDREANI_PASSWORD);
        if (!token) {
            throw new Error('Error al autenticar con Andreani. Por favor, verifica tus credenciales.');
        }

        const shipment = await trackShipment(trackingNumber, token);
        
        // Rellenar la tabla con los detalles del envío
        document.getElementById('result-tracking-number').textContent = shipment.bultos?.[0]?.numeroDeEnvio || trackingNumber;
        document.getElementById('result-status').textContent = shipment.estado || 'Desconocido';
        document.getElementById('result-branch').textContent = shipment.sucursalDeDistribucion?.descripcion || 'No disponible';
        document.getElementById('result-date').textContent = shipment.fechaCreacion || 'No disponible';
        document.getElementById('result-estimated-date').textContent = shipment.fechaEstimadaDeEntrega || 'No disponible';

        resultDiv.classList.remove('hidden'); // Mostrar la tabla de resultados
        globalErrorMessage.classList.add('hidden'); // Ocultar el mensaje de procesamiento si fue exitoso

    } catch (error) {
        console.error('Error en el seguimiento del envío:', error);
        globalErrorMessage.textContent = error.message;
        globalErrorMessage.classList.remove('hidden', 'success');
        globalErrorMessage.classList.add('error');
        resultDiv.classList.add('hidden');
    }
});

// Event listener para el formulario de creación de envío
document.getElementById('create-shipment-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Obtener referencias a los inputs y sus valores
    const contractInput = document.getElementById('contract');
    const serviceTypeInput = document.getElementById('service-type');
    const clientBranchIdInput = document.getElementById('client-branch-id');
    const originPostalCodeInput = document.getElementById('origin-postal-code');
    const destinationPostalCodeInput = document.getElementById('destination-postal-code');

    const contract = contractInput.value.trim();
    const serviceType = serviceTypeInput.value.trim();
    const clientBranchId = clientBranchIdInput.value.trim();
    const originPostalCode = originPostalCodeInput.value.trim();
    const destinationPostalCode = destinationPostalCodeInput.value.trim();

    const resultDiv = document.getElementById('result');
    const globalErrorMessage = document.getElementById('error-message');

    // Limpiar todos los errores visuales y mensajes globales antes de procesar
    globalErrorMessage.classList.add('hidden');
    resultDiv.classList.add('hidden');
    clearInputError(contractInput);
    clearInputError(serviceTypeInput);
    clearInputError(clientBranchIdInput);
    clearInputError(originPostalCodeInput);
    clearInputError(destinationPostalCodeInput);

    // Validar todos los inputs y acumular errores
    let hasError = false;
    const errors = [];

    const contractError = validateContract(contract);
    if (contractError) { showInputError(contractInput, contractError); errors.push(contractError); hasError = true; }
    const serviceTypeError = validateServiceType(serviceType);
    if (serviceTypeError) { showInputError(serviceTypeInput, serviceTypeError); errors.push(serviceTypeError); hasError = true; }
    const clientBranchIdError = validateClientBranchId(clientBranchId);
    if (clientBranchIdError) { showInputError(clientBranchIdInput, clientBranchIdError); errors.push(clientBranchIdError); hasError = true; }
    const originPostalCodeError = validatePostalCode(originPostalCode);
    if (originPostalCodeError) { showInputError(originPostalCodeInput, originPostalCodeError); errors.push(originPostalCodeError); hasError = true; }
    const destinationPostalCodeError = validatePostalCode(destinationPostalCode);
    if (destinationPostalCodeError) { showInputError(destinationPostalCodeInput, destinationPostalCodeError); errors.push(destinationPostalCodeError); hasError = true; }

    if (hasError) {
        globalErrorMessage.textContent = 'Por favor, corrige los errores en el formulario: ' + errors.join('; ');
        globalErrorMessage.classList.remove('hidden', 'success');
        globalErrorMessage.classList.add('error');
        return; // Detener la ejecución si hay errores de validación
    }

    // Mostrar mensaje de procesamiento
    globalErrorMessage.textContent = 'Procesando creación de envío...';
    globalErrorMessage.classList.remove('hidden', 'error');
    globalErrorMessage.classList.add('success');

    try {
        const token = await getAndreaniToken(ANDREANI_USER, ANDREANI_PASSWORD);
        if (!token) {
            throw new Error('Error al autenticar con Andreani. Por favor, verifica tus credenciales.');
        }

        const shipmentData = {
            contrato: contract,
            tipoDeServicio: serviceType,
            sucursalClienteID: parseInt(clientBranchId),
            origen: {
                postal: {
                    codigoPostal: originPostalCode
                }
            },
            destino: {
                postal: {
                    codigoPostal: destinationPostalCode
                }
            }
        };

        const response = await createShipment(token, shipmentData);

        globalErrorMessage.textContent = `✅ Envío creado con éxito. Número de envío: ${response.bultos?.[0]?.numeroDeEnvio || 'N/A'}`;
        globalErrorMessage.classList.remove('hidden', 'error');
        globalErrorMessage.classList.add('success');

        localStorage.setItem('envioCompletado', 'true');

    } catch (error) {
        console.error('Error en la creación del envío:', error);
        globalErrorMessage.textContent = `❌ Error al crear el envío: ${error.message}`;
        globalErrorMessage.classList.remove('hidden', 'success');
        globalErrorMessage.classList.add('error');
    }
});


const setupInputValidation = (inputElement, validatorFn) => {
    // Al enfocar (hacer click) en el input, limpia cualquier error visual previo
    inputElement.addEventListener('focus', () => {
        clearInputError(inputElement);
    });

    // Al perder el foco (hacer click fuera) del input, valida y muestra error si es necesario
    inputElement.addEventListener('blur', () => {
        const value = inputElement.value.trim();
        const error = validatorFn(value);
        if (error) {
            showInputError(inputElement, error);
        } else {
            clearInputError(inputElement);
        }
    });

    // Al escribir en el input, limpia el error si el contenido se vuelve válido
    inputElement.addEventListener('input', () => {
        const value = inputElement.value.trim();
        const error = validatorFn(value);
        if (!error) {
            clearInputError(inputElement);
        }
    });
};

// Aplicar la configuración de validación en tiempo real a cada input
setupInputValidation(document.getElementById('tracking-number'), validateTrackingNumber);
setupInputValidation(document.getElementById('contract'), validateContract);
setupInputValidation(document.getElementById('service-type'), validateServiceType);
setupInputValidation(document.getElementById('client-branch-id'), validateClientBranchId);
setupInputValidation(document.getElementById('origin-postal-code'), validatePostalCode);
setupInputValidation(document.getElementById('destination-postal-code'), validatePostalCode);