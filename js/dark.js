// Funcion para ofrecer tema oscuro
const boton = document.getElementById('tema');
const html = document.documentElement;

boton.addEventListener('click', function() {
    if (html.getAttribute('data-bs-theme') === 'dark'){
        html.setAttribute('data-bs-theme', 'light');
        boton.setAttribute('bg', 'dark');

    }else{
        html.setAttribute('data-bs-theme', 'dark');
        boton.setAttribute('bg', 'dark');

    }
})