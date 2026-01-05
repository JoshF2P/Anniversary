// Estructura de datos
let data = {
    years: {
        2024: { photos: [] },
        2025: { photos: [] },
        2026: { photos: [] }
    },
    loveLetter: ''
};

let currentYear = 2024;

// Cargar datos del localStorage al iniciar
function loadData() {
    const saved = localStorage.getItem('anniversaryData');
    if (saved) {
        data = JSON.parse(saved);
    } else {
        // Inicializar con datos por defecto
        data.years[2024].photos = [
            { image: null, message: '' },
            { image: null, message: '' },
            { image: null, message: '' }
        ];
        data.loveLetter = ``;
    }
    
    // Cargar la carta de amor
    document.getElementById('loveLetter').value = data.loveLetter;
}

// Guardar datos en localStorage
function saveData() {
    localStorage.setItem('anniversaryData', JSON.stringify(data));
}

// Contador de tiempo
function updateCounter() {
    const startDate = new Date('2024-01-04T00:00:00');
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('timeDisplay').innerHTML = `
        <div class="time-unit">
            <div class="number">${days}</div>
            <div class="label">Días</div>
        </div>
        <div class="time-unit">
            <div class="number">${hours}</div>
            <div class="label">Horas</div>
        </div>
        <div class="time-unit">
            <div class="number">${minutes}</div>
            <div class="label">Minutos</div>
        </div>
        <div class="time-unit">
            <div class="number">${seconds}</div>
            <div class="label">Segundos</div>
        </div>
    `;
}

// Mostrar año específico
function showYear(year) {
    currentYear = year;
    
    // Actualizar botones activos
    document.querySelectorAll('.year-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent == year) {
            btn.classList.add('active');
        }
    });
    
    // Mostrar/ocultar secciones
    document.querySelectorAll('.year-section').forEach(section => {
        section.classList.add('hidden');
        if (section.dataset.year == year) {
            section.classList.remove('hidden');
        }
    });
}

// Renderizar todas las secciones de años
function renderYears() {
    const container = document.getElementById('yearSections');
    container.innerHTML = '';
    
    Object.keys(data.years).forEach(year => {
        const section = document.createElement('div');
        section.className = 'year-section';
        section.dataset.year = year;
        if (year != currentYear) {
            section.classList.add('hidden');
        }
        
        section.innerHTML = `
            <h2 class="year-title">Año ${year} 💗</h2>
            <div class="gallery" id="gallery-${year}"></div>
            <button class="add-card-btn" onclick="addPhoto(${year})">➕ Agregar Recuerdo de ${year}</button>
        `;
        
        container.appendChild(section);
        
        // Renderizar fotos de este año
        renderPhotos(year);
    });
}

// Renderizar fotos de un año específico
function renderPhotos(year) {
    const gallery = document.getElementById(`gallery-${year}`);
    gallery.innerHTML = '';
    
    data.years[year].photos.forEach((photo, index) => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        
        const uploadId = `upload-${year}-${index}`;
        
        card.innerHTML = `
            <button class="delete-btn" onclick="deletePhoto(${year}, ${index})">✕</button>
            <div class="photo-container" onclick="document.getElementById('${uploadId}').click()">
                ${photo.image ? 
                    `<img src="${photo.image}" alt="Nuestra foto">` :
                    `<div class="photo-placeholder">
                        <div style="font-size: 3em;">📷</div>
                        <div>Haz click para subir una foto</div>
                        <span class="upload-btn">Subir Foto</span>
                    </div>`
                }
                <input type="file" id="${uploadId}" accept="image/*" onchange="loadImage(this, ${year}, ${index})" style="display: none;">
            </div>
            <textarea class="message-editable" 
                      placeholder="Escribe un mensaje bonito aquí..."
                      onchange="updateMessage(${year}, ${index}, this.value)">${photo.message}</textarea>
        `;
        
        gallery.appendChild(card);
    });
}

// Cargar imagen
function loadImage(input, year, index) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            data.years[year].photos[index].image = e.target.result;
            saveData();
            renderPhotos(year);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Actualizar mensaje
function updateMessage(year, index, message) {
    data.years[year].photos[index].message = message;
    saveData();
}

// Agregar nueva foto
function addPhoto(year) {
    data.years[year].photos.push({
        image: null,
        message: `Un recuerdo especial de ${year} 💗`
    });
    saveData();
    renderPhotos(year);
}

// Eliminar foto
function deletePhoto(year, index) {
    if (confirm('¿Estás seguro de eliminar este recuerdo?')) {
        data.years[year].photos.splice(index, 1);
        saveData();
        renderPhotos(year);
    }
}

// Crear corazones flotantes
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '💗';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    document.getElementById('hearts').appendChild(heart);

    setTimeout(() => heart.remove(), 7000);
}

// Crear iconos de fondo
function createBackgroundIcons() {
    // Pon aquí los nombres de tus imágenes
    const images = [
        'images/spiderman1.png',
        'images/jojo.png',
        'images/leon-ada.png',
        'images/draculaura.png',
        'images/hufflepuff.png',
        'images/bella.png'
    ];
    
    const container = document.getElementById('backgroundIcons');
    
    for (let i = 0; i < 25; i++) {
        const icon = document.createElement('div');
        icon.className = 'bg-icon';
        
        // Crear imagen en vez de emoji
        const img = document.createElement('img');
        img.src = images[Math.floor(Math.random() * images.length)];
        img.style.width = (Math.random() * 60 + 60) + 'px';
        img.style.height = 'auto';
        
        icon.appendChild(img);
        icon.style.left = Math.random() * 100 + '%';
        icon.style.top = Math.random() * 100 + '%';
        icon.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(icon);
    }
}

// Guardar carta de amor
document.addEventListener('DOMContentLoaded', function() {
    const loveLetterTextarea = document.getElementById('loveLetter');
    if (loveLetterTextarea) {
        // Función para ajustar altura automáticamente
        function adjustHeight() {
            loveLetterTextarea.style.height = 'auto';
            loveLetterTextarea.style.height = loveLetterTextarea.scrollHeight + 'px';
        }
        
        // Ajustar al cargar
        adjustHeight();
        
        // Ajustar al escribir
        loveLetterTextarea.addEventListener('input', adjustHeight);
        
        // Guardar cambios
        loveLetterTextarea.addEventListener('change', function() {
            data.loveLetter = this.value;
            saveData();
        });
    }
});

// Inicializar
loadData();
renderYears();
updateCounter();
setInterval(updateCounter, 1000);
setInterval(createHeart, 2000);
createBackgroundIcons();

// Función para cambiar tema
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    data.darkMode = isDark;
    saveData();
    
    const btn = document.getElementById('themeToggle');
    btn.innerHTML = isDark ? '<span class="theme-icon">☀️</span>' : '<span class="theme-icon">🌙</span>';
}