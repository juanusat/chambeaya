(function () {
    function mostrarFormulario(tipo) {
        const registro = document.getElementById('registro');
        const login = document.getElementById('login');
        const tabs = document.querySelectorAll('.tab-btn');

        if (tipo === 'registro') {
            registro.classList.remove('hidden');
            login.classList.add('hidden');
            tabs[0].classList.add('active');
            tabs[1].classList.remove('active');
        } else {
            registro.classList.add('hidden');
            login.classList.remove('hidden');
            tabs[1].classList.add('active');
            tabs[0].classList.remove('active');
        }
    }
    document.getElementById('show_registro').addEventListener('click', function () {
        mostrarFormulario('registro')
    })
    document.getElementById('show_ingresar').addEventListener('click', function () {
        mostrarFormulario('ingresar')
    })
    if (location.search == '?i') {
        mostrarFormulario('ingresar')
    }
    document.getElementById('login').addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const keepLoggedIn = document.getElementById('keep-logged-in').checked;

        let navegadorInfo = "Desconocido";

        if (navigator.userAgentData) {
            const uaData = navigator.userAgentData;
            const brands = uaData.brands.map(b => `${b.brand} v${b.version}`).join(', ');
            const platform = uaData.platform || "Desconocido";
            navegadorInfo = `${brands} para ${platform}`;
        } else {
            const ua = navigator.userAgent;
            if (ua.includes("Chrome")) {
                navegadorInfo = "Chrome para " + detectarSistema(ua);
            } else if (ua.includes("Firefox")) {
                navegadorInfo = "Firefox para " + detectarSistema(ua);
            } else if (ua.includes("Safari")) {
                navegadorInfo = "Safari para " + detectarSistema(ua);
            } else {
                navegadorInfo = "Navegador desconocido";
            }
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                credentials: 'same-origin', // para enviar/recibir cookies
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password,
                    remember: keepLoggedIn,
                    dispositivo: navegadorInfo
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('logged', 'true');
                localStorage.setItem('keepLoggedIn', keepLoggedIn ? 'true' : 'false');

                if (!keepLoggedIn) {
                    sessionStorage.setItem('sessionActive', 'true');
                }
                window.location.href = '/';
            } else {
                alert('Error de inicio de sesión: ' + (data.msg || 'Intenta de nuevo'));
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('No se pudo conectar con el servidor.');
        }
    });

    const avaRegistro = true
    if (avaRegistro) {
        const form = document.getElementById('registro')
        const correo = document.getElementById('correo')
        const usuario = document.getElementById('usuario')
        const contrasena = document.getElementById('contrasena')
        const btnEmpresa = document.getElementById('continue-empresa')
        const btnPersona = document.getElementById('continue-persona')
        const empresaSection = document.getElementById('empresa-section')
        const personaSection = document.getElementById('persona-section')
        const submitBtn = document.getElementById('submit-btn')

        const empresaFields = [
            document.getElementById('empresa-nombre'),
            document.getElementById('empresa-ruc'),
            document.getElementById('empresa-fecha')
        ]

        const personaFields = [
            document.getElementById('persona-nombres'),
            document.getElementById('persona-apellidos'),
            document.getElementById('persona-fecha'),
            document.getElementById('persona-telefono'),
            document.getElementById('persona-foto')
        ]

        let formType = null

        function checkCommonFields() {
            const valid = correo.value.trim() && usuario.value.trim() && contrasena.value
            btnEmpresa.disabled = !valid
            btnPersona.disabled = !valid
        }

        [correo, usuario, contrasena].forEach(el =>
            el.addEventListener('input', checkCommonFields)
        )

        function setSection(type) {
            formType = type
            empresaSection.style.display = type === 'empresa' ? 'block' : 'none'
            personaSection.style.display = type === 'persona' ? 'block' : 'none'
            empresaFields.forEach(f => f.required = type === 'empresa')
            personaFields.forEach(f => f.required = type === 'persona')
            btnEmpresa.disabled = true
            btnPersona.disabled = true
            submitBtn.disabled = false
        }

        btnEmpresa.addEventListener('click', () => setSection('empresa'))
        btnPersona.addEventListener('click', () => setSection('persona'))

        form.addEventListener('submit', async e => {
            e.preventDefault()
            if (!formType) return

            const url = formType === 'empresa'
                ? '/api/auth/registrar_empresa'
                : '/api/auth/registrar_persona'

            const formData = new FormData()
            formData.append('correo', correo.value.trim())
            formData.append('usuario', usuario.value.trim())
            formData.append('contrasena', contrasena.value)

            if (formType === 'empresa') {
                formData.append('nombre', document.getElementById('empresa-nombre').value.trim())
                formData.append('ruc', document.getElementById('empresa-ruc').value.trim())
                formData.append('fechaCreacion', document.getElementById('empresa-fecha').value)
            } else {
                formData.append('nombres', document.getElementById('persona-nombres').value.trim())
                formData.append('apellidos', document.getElementById('persona-apellidos').value.trim())
                formData.append('fechaNacimiento', document.getElementById('persona-fecha').value)
                formData.append('telefono', document.getElementById('persona-telefono').value.trim())
                formData.append('foto', document.getElementById('persona-foto').files[0])
            }

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'same-origin',
                    body: formData
                })
                const data = await response.json()
                if (response.ok) {
                    alert('Registro exitoso. Ahora puedes iniciar sesión.')
                    window.location.href = '/acceder?i'
                } else {
                    alert('Error al registrarse: ' + (data.msg || 'Intenta de nuevo'))
                }
            } catch (error) {
                console.error('Error al registrarse:', error)
                alert('No se pudo conectar con el servidor.')
            }
        })

    }

})();
