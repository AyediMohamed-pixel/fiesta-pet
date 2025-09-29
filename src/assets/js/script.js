document.addEventListener('DOMContentLoaded', function() {
    const petForm = document.getElementById('petForm');
    
    // Handle animal type button selection
    const animalButtons = document.querySelectorAll('.animal-btn');
    const animalTypeInput = document.getElementById('animalType');
    
    animalButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            animalButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Update hidden input value
            animalTypeInput.value = this.dataset.animal;
        });
    });
    const qrResult = document.getElementById('qrResult');
    const qrCodeDiv = document.getElementById('qrcode');
    const newFormBtn = document.getElementById('newForm');

    petForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(petForm);
        const petInfo = {};
        
        for (let [key, value] of formData.entries()) {
            if (key === 'phone[]') {
                if (!petInfo.phones) {
                    petInfo.phones = [];
                }
                if (value.trim() !== '') {
                    petInfo.phones.push(value);
                }
            } else {
                petInfo[key] = value;
            }
        }
        
        // Ensure animal type is included
        if (!petInfo.animalType) {
            petInfo.animalType = document.getElementById('animalType').value;
        }
        
        // Create URL with parameters
        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '') + 'pet-info.html';
        const params = new URLSearchParams();
        
        // Add all non-empty values to URL
        Object.keys(petInfo).forEach(key => {
            if (key === 'phones' && petInfo.phones && petInfo.phones.length > 0) {
                petInfo.phones.forEach((phone, index) => {
                    params.append(`phone${index + 1}`, phone);
                });
            } else if (petInfo[key] && petInfo[key].trim() !== '') {
                params.append(key, petInfo[key]);
            }
        });
        
        const fullUrl = baseUrl + '?' + params.toString();
        
        // Clear previous QR code
        qrCodeDiv.innerHTML = '';
        
        // Check if QRCode library is loaded
        if (typeof QRCode === 'undefined') {
            alert('QR Code library is not loaded. Please refresh the page and try again.');
            return;
        }
        
        try {
            // Generate QR code using the davidshimjs/qrcodejs library
            const qr = new QRCode(qrCodeDiv, {
                text: fullUrl,
                width: 256,
                height: 256,
                colorDark: '#333333',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H // Higher error correction for logo overlay
            });
            
            // Add logo to QR code after a short delay to ensure QR code is rendered
            setTimeout(() => {
                addLogoToQRCode();
            }, 100);
            
            // Show QR result and hide form
            petForm.style.display = 'none';
            qrResult.style.display = 'block';
            qrResult.classList.add('fade-in');
        } catch (error) {
            console.error('QR Code generation failed:', error);
            alert('Failed to generate QR code. Please try again.');
        }
    });
    
    // Function to reset form
    window.resetForm = function() {
        petForm.reset();
        petForm.style.display = 'block';
        qrResult.style.display = 'none';
        // Remove selected class from animal buttons
        animalButtons.forEach(btn => btn.classList.remove('selected'));
        animalTypeInput.value = '';
    };
    
    // Add smooth animations to form inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});

// Add some CSS for the focused state
const style = document.createElement('style');
style.textContent = `
    .form-group.focused label {
        color: #667eea;
        transform: translateY(-2px);
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// Function to add phone field
function addPhoneField() {
    const phoneContainer = document.getElementById('phoneContainer');
    const phoneInputGroup = document.createElement('div');
    phoneInputGroup.className = 'phone-input-group';
    
    phoneInputGroup.innerHTML = `
        <input type="tel" name="phone[]" placeholder="Numéro de téléphone">
        <button type="button" class="remove-phone-btn" onclick="removePhoneField(this)">-</button>
    `;
    
    phoneContainer.appendChild(phoneInputGroup);
}

// Function to remove phone field
function removePhoneField(button) {
    const phoneContainer = document.getElementById('phoneContainer');
    const phoneGroups = phoneContainer.querySelectorAll('.phone-input-group');
    
    // Keep at least one phone field
    if (phoneGroups.length > 1) {
        button.parentElement.remove();
    }
}

// Function to add logo to QR code
function addLogoToQRCode() {
    const qrCodeDiv = document.getElementById('qrcode');
    const canvas = qrCodeDiv.querySelector('canvas');
    
    if (!canvas) {
        console.error('QR Code canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const logo = new Image();
    
    logo.onload = function() {
        // Calculate logo size (about 20% of QR code size)
        const logoSize = canvas.width * 0.2;
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;
        
        // Add white background circle for logo
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, logoSize / 2 + 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw logo
        ctx.drawImage(logo, x, y, logoSize, logoSize);
    };
    
    logo.onerror = function() {
        console.error('Failed to load logo image');
    };
    
    // Load the logo image
    logo.src = '7.png';
}