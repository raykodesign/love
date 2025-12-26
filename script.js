document.addEventListener('DOMContentLoaded', () => {
    
    // --- NUEVO EFECTO MOUSE: MARIPOSAS ---
    let colorToggle = false; 

    document.addEventListener('mousemove', (e) => {
        // Reducimos frecuencia para no saturar
        if(Math.random() > 0.2) return;

        // Crear mariposa
        const butterfly = document.createElement('div');
        butterfly.classList.add('magic-butterfly');
        
        // Alternar color (dorado por defecto, azul si tiene clase .blue)
        if (colorToggle) {
            butterfly.classList.add('blue');
        }
        colorToggle = !colorToggle; 

        // Posición mouse
        butterfly.style.left = e.pageX + 'px';
        butterfly.style.top = e.pageY + 'px';
        
        document.body.appendChild(butterfly);

        // Eliminar
        setTimeout(() => {
            butterfly.remove();
        }, 1000);
    });

    // --- ELEMENTOS PRINCIPALES ---
    const enterScreen = document.getElementById('enter-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainLayout = document.getElementById('main-layout');
    const typingText = document.getElementById('typing-text');
    const audio = document.getElementById('audio');
    const vinyl = document.getElementById('vinyl');
    const playIcon = document.getElementById('play-icon');
    const progressBar = document.getElementById('progress-bar');

    // --- ENTRADA ---
    enterBtn.addEventListener('click', () => {
        enterScreen.style.opacity = '0';
        
        setTimeout(() => {
            enterScreen.style.display = 'none';
            mainLayout.classList.remove('hidden-layout');
            
            setTimeout(() => {
                document.querySelector('.nav-menu').classList.add('animate-buttons');
            }, 300);

            initTypewriter();
            playMusic();
        }, 800);
    });

    // --- MAQUINA DE ESCRIBIR (NUEVA FUENTE APLICADA EN CSS) ---
    const welcomeMsg = "Eres mi amor para otra vida, mi amor para otra ocasión. Llegaste demasiado pronto y aun así fue tarde. Me entendías más que nadie, y no existía alguien, que te quisiera más que yo. Siempre he creído que todo es posible y que lo imposible...Solo tarda un poquito más. Pero querido amor imposible, contigo esa teoría está de más. A veces siento que fuimos impuntuales, o que el destino se haya encaprichado tantocon nosotros...Que decidió ponernos un inuto tarde. Tal vez una persona antes o una persona después fuimos todo y no fuimos nada.";
    function initTypewriter() {
        let i = 0;
        typingText.innerHTML = "";
        function type() {
            if (i < welcomeMsg.length) {
                typingText.innerHTML += welcomeMsg.charAt(i);
                i++;
                setTimeout(type, 50); // Un poco más lento para la cursiva
            }
        }
        type();
    }

    // --- GESTIÓN DE MODALES ---
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.add('active');
            mainLayout.style.filter = "blur(10px) grayscale(50%)";
            mainLayout.style.transform = "scale(0.98)";
            
            // Si es galería, recalcular posición con un pequeño delay para asegurar que el DOM ya pintó el modal
            if(modalId === 'modal-gallery') {
                setTimeout(() => {
                    updateGallery3D();
                }, 50);
            }
        }
    };

    window.closeModal = function(modalId) {
        document.getElementById(modalId).classList.remove('active');
        mainLayout.style.filter = "none";
        mainLayout.style.transform = "scale(1)";
    };
    
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) closeModal(e.target.id);
    };

    // --- GALERÍA 3D (CORREGIDA Y CENTRADA) ---
    const galleryImages = [
        "https://xatimg.com/image/UCQwTE98gue9.jpg",
        "https://xatimg.com/image/IgoLKiYoP4US.jpg",
        "https://xatimg.com/image/zW5u9rAT5bGG.jpg",
        "https://xatimg.com/image/PvR3iKQx9OaC.jpg",
        "https://xatimg.com/image/BNX5ggQBfmVQ.jpg",
        "https://xatimg.com/image/eqCh9ZG6GvqM.jpg",
    ];
    
    const carouselTrack = document.getElementById('carousel-3d-track');
    let galleryIndex = 0; 

    // Renderizar cartas
    carouselTrack.innerHTML = "";
    galleryImages.forEach((src, i) => {
        const card = document.createElement('div');
        card.className = 'card-3d-gold';
        card.innerHTML = `<img src="${src}" alt="Img ${i}" style="width:100%;height:100%;object-fit:cover;">`;
        card.onclick = () => { galleryIndex = i; updateGallery3D(); };
        carouselTrack.appendChild(card);
    });

    // Función de centrado precisa
    window.updateGallery3D = () => {
        const cards = document.querySelectorAll('#carousel-3d-track .card-3d-gold');
        if(!cards.length) return;
        
        // Activar clase
        cards.forEach(c => c.classList.remove('active'));
        if(cards[galleryIndex]) cards[galleryIndex].classList.add('active');

        // Cálculos matemáticos precisos
        const container = document.querySelector('.gallery-container-3d');
        const containerWidth = container.offsetWidth;
        
        // Obtener ancho real de la tarjeta (incluyendo margen si es posible, pero offsetWidth es seguro)
        const cardWidth = cards[0].offsetWidth; 
        const cardMargin = 40; // 20px izquierda + 20px derecha definidos en CSS
        const fullCardSpace = cardWidth + cardMargin;

        // Formula: Centro del contenedor - (Posición de la carta actual) - (Mitad de la carta actual)
        // Ajuste: +20 es para compensar el margen inicial izquierdo de la primera carta
        const centerPosition = (containerWidth / 2) - (galleryIndex * fullCardSpace) - (cardWidth / 2) - 20;

        carouselTrack.style.transform = `translateX(${centerPosition}px)`;
    };

    window.moveGallery = (dir) => {
        galleryIndex += dir;
        if(galleryIndex < 0) galleryIndex = galleryImages.length - 1;
        if(galleryIndex >= galleryImages.length) galleryIndex = 0;
        updateGallery3D();
    };

    // --- MÚSICA ---
    const playlist = [
        { title: "BIRDS OF A FEATHER", artist: "Billie Eilish", src: "audio/Billie Eilish - BIRDS OF A FEATHER.mp3" },
    ];
    let sIdx = 0; let isPlaying = false; let pInt;

    function loadMusic(i) {
        audio.src = playlist[i].src;
        document.getElementById('song-title').innerText = playlist[i].title;
        document.getElementById('song-artist').innerText = playlist[i].artist;
    }
    
    window.playMusic = () => {
        audio.play().then(() => {
            isPlaying = true;
            vinyl.classList.add('vinyl-spin');
            playIcon.className = "fas fa-pause";
            pInt = setInterval(() => {
                progressBar.style.width = (audio.currentTime/audio.duration)*100 + "%";
            }, 100);
        }).catch(() => {});
    };
    
    window.togglePlay = () => {
        if(isPlaying) {
            audio.pause(); isPlaying = false;
            vinyl.classList.remove('vinyl-spin');
            playIcon.className = "fas fa-play";
            clearInterval(pInt);
        } else {
            playMusic();
        }
    };
    
    window.nextSong = () => { sIdx=(sIdx+1)%playlist.length; loadMusic(sIdx); playMusic(); };
    window.prevSong = () => { sIdx=(sIdx-1+playlist.length)%playlist.length; loadMusic(sIdx); playMusic(); };
    loadMusic(0);

    // Re-calcular galería si cambian tamaño de ventana
    window.addEventListener('resize', () => {
        updateGallery3D();
    });
});