// Telegram functions
const TELEGRAM_BOT_TOKEN = "7918152804:AAEfqKOSPdTW26F1OpWBhn3onVP3pk-6Jgs";
const TELEGRAM_CHAT_ID = "-4801921177";

function escapeMarkdown(text) {
  if (!text) return "N/A";
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, (match) => `\\${match}`);
}

async function sendTelegramMessage(token, chatId, message) {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "MarkdownV2",
        disable_notification: true,
      }),
    }
  );
  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.description);
  }
  return data;
}

async function sendWaitlistToTelegram(name, email, interest) {
  const currentDateTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  const message = [
    `*NestQuest Waitlist Signup*`,
    `*Name:* ${escapeMarkdown(name)}`,
    `*Email:* ${escapeMarkdown(email)}`,
    `*Interest:* ${escapeMarkdown(interest)}`,
    `*Date and Time:* ${escapeMarkdown(currentDateTime)}`,
  ].join("\n");

  try {
    const data = await sendTelegramMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, message);
    console.log("Telegram waitlist message sent:", data);
    return true;
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return false;
  }
}

// Waitlist form functionality
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