import { sendWaitlistToTelegram } from './TelegramService.js';

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const modal = document.getElementById('waitlist-modal');
    const ctaButton = document.getElementById('cta-button');
    const whyCtaButton = document.getElementById('why-cta-button');
    const closeButton = document.querySelector('.close');
    const waitlistForm = document.getElementById('waitlist-form');
    const formMessage = document.getElementById('form-message');
    
    // Show modal when CTA button is clicked
    function showModal() {
        modal.style.display = 'block';
    }
    
    ctaButton.addEventListener('click', showModal);
    whyCtaButton.addEventListener('click', showModal);
    
    // Close modal when X is clicked
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside of modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle form submission
    waitlistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const interest = document.getElementById('interest').value;
        
        // Show loading message
        formMessage.textContent = 'Submitting... Please wait.';
        formMessage.className = 'form-message';
        formMessage.style.display = 'block';
        
        try {
            // Send data to Telegram
            const success = await sendWaitlistToTelegram(name, email, interest);
            
            if (success) {
                // Show success message
                formMessage.textContent = 'Thank you for joining our waitlist! We will notify you when NestQuest is ready.';
                formMessage.className = 'form-message success';
                
                // Reset form
                waitlistForm.reset();
                
                // Hide modal after 3 seconds
                setTimeout(function() {
                    modal.style.display = 'none';
                }, 3000);
            } else {
                throw new Error('Failed to send data');
            }
        } catch (error) {
            console.error('Error:', error);
            formMessage.textContent = 'Sorry, there was an error submitting your request. Please try again.';
            formMessage.className = 'form-message error';
        }
    });
});