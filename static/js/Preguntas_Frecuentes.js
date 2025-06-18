// /static/js/faqs.js

document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentNode;
            const faqAnswer = faqItem.querySelector('.faq-answer');

            // Cierra todas las demás respuestas abiertas
            faqQuestions.forEach(otherButton => {
                if (otherButton !== button && otherButton.classList.contains('active')) {
                    otherButton.classList.remove('active');
                    otherButton.parentNode.querySelector('.faq-answer').classList.remove('active');
                    otherButton.parentNode.querySelector('.faq-answer').style.maxHeight = 0;
                    otherButton.parentNode.querySelector('.faq-answer').style.padding = '0 25px'; // Restaura padding
                }
            });

            // Alterna la clase 'active' para el botón y la respuesta actual
            button.classList.toggle('active');
            faqAnswer.classList.toggle('active');

            // Ajusta la altura máxima para la animación
            if (faqAnswer.classList.contains('active')) {
                // Calcula la altura real del contenido para la animación smooth
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
                faqAnswer.style.padding = '20px 25px'; // Ajusta el padding cuando se abre
            } else {
                faqAnswer.style.maxHeight = 0;
                faqAnswer.style.padding = '0 25px'; // Restaura padding cuando se cierra
            }
        });
    });
});