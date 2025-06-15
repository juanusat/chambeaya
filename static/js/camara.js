(function () {
    const inputFoto = document.getElementById('persona-foto');
    const modal = document.getElementById('face-modal');
    const video = document.getElementById('inputVideo');
    const circle = document.getElementById('circle');
    const infoDiv = document.getElementById('myDiv01');
    const startBtn = document.getElementById('startBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cameraSelect = document.getElementById('cameraSelect');
    const countdownDisplay = document.getElementById('countdown-display');
    
    // Variables de estado
    let modelsLoaded = false;
    let currentStream = null;
    let animationFrameId = null;
    let countdownTimer = null; // Para el temporizador de la cuenta regresiva
    let isCountingDown = false; // Bandera para evitar múltiples temporizadores
    
    // --- Funciones para el flujo del modal y cámara ---
    
    // Evitar que el input file abra selector de archivos y abrir modal
    inputFoto.addEventListener('click', (e) => {
        e.preventDefault(); // bloquear abrir selector tradicional
        openModal();
    });
    
    async function openModal() {
        modal.style.display = 'flex';
        infoDiv.textContent = 'Cargando modelos...';
        await loadModels();
        await getCameras();
        // Si ya hay cámaras y modelos cargados, habilitar el botón de iniciar
        if (modelsLoaded && cameraSelect.options.length > 0) {
            startBtn.disabled = false;
        }
    }
    
    closeModalBtn.addEventListener('click', () => {
        stopStream();
        modal.style.display = 'none';
        infoDiv.textContent = '';
        circle.classList.remove('green'); // Asegúrate de quitar la clase verde al cerrar
        circle.style.borderColor = 'red'; // Restablecer a rojo
        stopCountdown(); // Detener el contador si está activo
        countdownDisplay.style.display = 'none'; // Ocultar contador
    });
    
    startBtn.addEventListener('click', () => {
        if (cameraSelect.value && modelsLoaded) {
            startCamera(cameraSelect.value);
        } else if (!modelsLoaded) {
            infoDiv.textContent = "⏳ Modelos aún no cargados.";
        } else {
            infoDiv.textContent = "⚠️ No hay cámara seleccionada.";
        }
    });
    
    cameraSelect.addEventListener('change', () => {
        // Al cambiar de cámara, detén el stream actual si existe
        stopStream();
        // Habilita el botón de iniciar cámara nuevamente si hay una seleccionada
        if (cameraSelect.value) {
            startBtn.disabled = false;
            infoDiv.textContent = 'Listo para iniciar cámara.';
        } else {
            startBtn.disabled = true;
            infoDiv.textContent = 'Selecciona una cámara.';
        }
        stopCountdown(); // Detener el contador si cambia la cámara
        countdownDisplay.style.display = 'none';
    });
    
    async function loadModels() {
        if (modelsLoaded) return;
        infoDiv.textContent = "⏳ Cargando modelos de IA...";
        try {
            const modelUrl = 'https://www.rocksetta.com/tensorflowjs/saved-models/face-api-js/';
            await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
            await faceapi.nets.faceLandmark68TinyNet.loadFromUri(modelUrl);
            modelsLoaded = true;
            infoDiv.textContent = "✅ Modelos cargados. Selecciona e inicia la cámara.";
            // Si ya hay cámaras disponibles, habilitar el botón de iniciar
            if (cameraSelect.options.length > 0) {
                startBtn.disabled = false;
            }
        } catch (e) {
            console.error(e);
            infoDiv.textContent = "❌ Error cargando modelos. Revisa la consola.";
        }
    }
    
    async function getCameras() {
        try {
            // Solicitar permiso una vez para enumerar dispositivos
            await navigator.mediaDevices.getUserMedia({ video: true });
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(d => d.kind === 'videoinput');
            cameraSelect.innerHTML = ''; // Limpiar opciones anteriores
    
            if (videoDevices.length === 0) {
                infoDiv.textContent = "⚠️ No se encontraron cámaras disponibles.";
                startBtn.disabled = true;
                return;
            }
    
            videoDevices.forEach((device, i) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Cámara ${i + 1}`;
                cameraSelect.appendChild(option);
            });
            // Habilitar el botón de iniciar si los modelos ya están cargados y hay cámaras
            if (modelsLoaded && cameraSelect.options.length > 0) {
                startBtn.disabled = false;
            }
        } catch (err) {
            console.error(err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                infoDiv.textContent = "❌ Permiso de cámara denegado. Por favor habilítalo en la configuración del navegador.";
            } else {
                infoDiv.textContent = "❌ Error al acceder a la cámara.";
            }
            startBtn.disabled = true;
        }
    }
    
    function stopStream() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            currentStream = null;
        }
        video.srcObject = null;
        circle.classList.remove('green'); // Asegúrate de quitar la clase verde al detener
        circle.style.borderColor = 'red'; // Restablecer a rojo
        stopCountdown(); // Detener el contador
        countdownDisplay.style.display = 'none'; // Ocultar contador
    }
    
    // Función para redimensionar el círculo (basado en el tamaño del video)
    function resizeCircle() {
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        if (vw > 0 && vh > 0) {
            const smaller = Math.min(vw, vh);
            const size = smaller * 0.65; // Ajusta este factor para cambiar el tamaño del círculo
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            // Centrar el círculo en el video
            circle.style.left = `50%`;
            circle.style.top = `50%`;
            circle.style.transform = `translate(-50%, -50%)`;
        }
    }
    
    async function startCamera(deviceId) {
        stopStream(); // Detener cualquier stream anterior
        try {
            infoDiv.textContent = 'Iniciando cámara...';
            currentStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: deviceId },
                    width: { ideal: 640 }, // Puedes ajustar el tamaño ideal
                    height: { ideal: 480 }
                }
            });
            video.srcObject = currentStream;
            video.onloadedmetadata = () => {
                resizeCircle(); // Asegúrate de redimensionar el círculo una vez cargado el video
                video.play().catch(e => {
                    console.error("Error al reproducir video:", e);
                    infoDiv.textContent = "❌ Error al reproducir video.";
                    stopStream();
                });
            };
            video.onplay = () => {
                infoDiv.textContent = 'Cámara iniciada. Centra tu rostro en el círculo.';
                detectFaceLoop(); // Iniciar el bucle de detección una vez que el video esté reproduciéndose
            };
        } catch (e) {
            infoDiv.textContent = 'Error al iniciar la cámara.';
            console.error(e);
            stopStream(); // Asegurarse de limpiar en caso de error
        }
    }
    
    // --- Lógica de Detección Facial y Cuenta Regresiva ---
    
    async function detectFaceLoop() {
        if (!video || video.paused || video.ended || !modelsLoaded) {
            animationFrameId = requestAnimationFrame(detectFaceLoop); // Seguir intentando si está en pausa o no cargado
            return;
        }
    
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
        let result = null;
        try {
            result = await faceapi.detectSingleFace(video, options).withFaceLandmarks(true);
        } catch (e) {
            console.error("Error en faceapi.detectSingleFace:", e);
            infoDiv.textContent = '❌ Error en detección facial.';
            stopCountdown(); // Detener el contador si hay un error de detección
            circle.classList.remove('green');
            circle.style.borderColor = 'red';
            animationFrameId = requestAnimationFrame(detectFaceLoop);
            return;
        }
    
        if (result) {
            const resized = faceapi.resizeResults(result, {
                width: video.videoWidth,
                height: video.videoHeight
            });
            const box = resized.detection.box;
    
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
    
            // Calcula el centro del círculo y la tolerancia para el centrado
            const circleDiameter = Math.min(videoWidth, videoHeight) * 0.8; // Asumiendo que el círculo ocupa el 80% del menor lado del video
            const circleRadius = circleDiameter / 2;
            const circleCenterX = videoWidth / 2;
            const circleCenterY = videoHeight / 2;
    
            // Define una tolerancia para el centrado del rostro dentro del círculo
            const toleranceFactor = 0.25; // Ajusta este valor si necesitas más o menos precisión (ej: 0.2 a 0.35)
            const tolerance = circleRadius * toleranceFactor;
    
            // Calcula el centro del rostro detectado
            const faceCenterX = box.x + box.width / 2;
            const faceCenterY = box.y + box.height / 2;
    
            // Calcula la distancia entre el centro del rostro y el centro del círculo
            const distance = Math.hypot(faceCenterX - circleCenterX, faceCenterY - circleCenterY);
    
            const isCentered = distance < tolerance;
    
            if (isCentered) {
                circle.classList.add('green');
                infoDiv.textContent = "✅ Rostro Centrado. Mantente quieto para la foto...";
    
                // Iniciar cuenta regresiva si no está ya en progreso
                if (!isCountingDown) {
                    startCountdown(3); // Inicia cuenta regresiva de 5 segundos
                }
            } else {
                circle.classList.remove('green');
                circle.style.borderColor = 'red'; // Asegurarse de que esté rojo si no está centrado
                infoDiv.textContent = "⚠️ Mueve tu rostro al centro del círculo.";
                stopCountdown(); // Detener cuenta regresiva si el rostro se mueve
            }
        } else {
            circle.classList.remove('green');
            circle.style.borderColor = 'red'; // Asegurarse de que esté rojo si no hay rostro
            infoDiv.textContent = '⚪ Coloca tu rostro en el círculo.';
            stopCountdown(); // Detener cuenta regresiva si no se detecta rostro
        }
    
        animationFrameId = requestAnimationFrame(detectFaceLoop);
    }
    
    // --- Funciones de Cuenta Regresiva y Captura de Foto ---
    
    function startCountdown(seconds) {
        isCountingDown = true;
        countdownDisplay.style.display = 'block'; // Mostrar el contador
        let counter = seconds;
    
        countdownDisplay.textContent = counter;
    
        countdownTimer = setInterval(() => {
            counter--;
            countdownDisplay.textContent = counter;
    
            if (counter <= 0) {
                clearInterval(countdownTimer);
                countdownTimer = null;
                isCountingDown = false;
                countdownDisplay.style.display = 'none'; // Ocultar contador
                capturePhoto(); // Llamar a la función para tomar la foto
            }
        }, 1000); // Actualizar cada segundo
    }
    
    function stopCountdown() {
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
        isCountingDown = false;
        countdownDisplay.style.display = 'none'; // Ocultar contador
        countdownDisplay.textContent = ''; // Limpiar el texto del contador
    }
    async function capturePhoto() {
        if (!video || video.paused || video.ended || video.readyState < 3) {
            infoDiv.textContent = '❌ No se pudo tomar la foto: video no disponible o no listo.';
            console.error('Video no disponible o no listo para la captura. readyState:', video.readyState);
            return;
        }
    
        infoDiv.textContent = '📸 Capturando foto...';
    
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        const context = canvas.getContext('2d');
        if (!context) {
            infoDiv.textContent = '❌ Error: No se pudo obtener el contexto 2D del canvas.';
            console.error('No se pudo obtener el contexto 2D del canvas.');
            return;
        }
    
        // Dibuja el frame actual del video en el canvas PRIMERO
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        // AHORA sí, detén el stream DESPUÉS de que el frame ha sido dibujado en el canvas
        stopStream(); // MUEVE ESTA LÍNEA AQUÍ
    
        // Convertir el canvas a un Blob
        canvas.toBlob(blob => {
            if (blob) {
                // Crear un objeto File desde el Blob
                const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
                const fileName = `profile_photo_${timestamp}.png`;
                const file = new File([blob], fileName, { type: 'image/png' });
    
                // Crear un DataTransfer y asignarlo al input file
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                inputFoto.files = dataTransfer.files;
    
                infoDiv.textContent = '✅ Foto tomada y asignada. Puedes cerrar el modal.';
                console.log('Foto asignada al input file:', inputFoto.files[0]);
    
            } else {
                infoDiv.textContent = '❌ Error al procesar la foto (Blob es nulo).';
                console.error('Error: toBlob devolvió un blob nulo o hubo un problema al procesar la imagen.');
            }
        }, 'image/png', 0.9); // Formato PNG, calidad 0.9
    }
    
    // --- Inicialización al cargar la ventana ---
    
    window.addEventListener('load', () => {
        infoDiv.textContent = "⏳ Inicializando...";
        Promise.all([getCameras(), loadModels()]).then(() => {
            if (modelsLoaded && cameraSelect.options.length > 0) {
                infoDiv.textContent = "Listo. Selecciona una cámara y haz clic en 'Iniciar Cámara'.";
                startBtn.disabled = false;
            } else if (!modelsLoaded) {
                infoDiv.textContent = "❌ Error al cargar modelos. Recarga la página.";
            } else if (cameraSelect.options.length === 0) {
                infoDiv.textContent = "⚠️ No se encontraron cámaras.";
            }
        }).catch(error => {
            console.error("Error grave durante la inicialización:", error);
            infoDiv.textContent = "❌ Error grave durante la inicialización.";
        });
    });
})()