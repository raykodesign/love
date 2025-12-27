document.addEventListener('DOMContentLoaded', () => {
    
    // --- EFECTO MOUSE: SOLO BRILLOS (SIN EMOJIS) ---
    document.addEventListener('mousemove', (e) => {
        // Reducimos la frecuencia (crea 1 cada 25ms aprox)
        if(Math.random() > 0.15) return;

        // Crear el elemento de brillo
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Posición exacta del mouse + pequeña variación
        const x = e.pageX + (Math.random() * 10 - 5);
        const y = e.pageY + (Math.random() * 10 - 5);
        
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        // Color aleatorio entre blanco y dorado/morado del tema
        const colors = ['#ffffff', '#b026ff', '#e0aaff', '#ff007f'];
        sparkle.style.background = `radial-gradient(circle, #fff 10%, ${colors[Math.floor(Math.random() * colors.length)]} 100%)`;

        document.body.appendChild(sparkle);

        // Eliminar del DOM al terminar la animación
        setTimeout(() => {
            sparkle.remove();
        }, 800);
    });

    // --- ELEMENTOS ---
    const enterScreen = document.getElementById('enter-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainLayout = document.getElementById('main-layout');
    const typingText = document.getElementById('typing-text');
    const audio = document.getElementById('audio');
    const vinyl = document.getElementById('vinyl');
    const playIcon = document.getElementById('play-icon');
    const progressBar = document.getElementById('progress-bar');

    // --- ENTRADA Y MÚSICA INSTANTÁNEA ---
    enterBtn.addEventListener('click', () => {
        // 1. INTENTAR REPRODUCIR AUDIO INMEDIATAMENTE
        // Esto es necesario porque los navegadores bloquean el audio 
        // a menos que sea una respuesta directa a un clic.
        if(audio) {
            audio.volume = 0.5; // Volumen inicial
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Audio inició correctamente
                    isPlaying = true;
                    if(vinyl) vinyl.classList.add('vinyl-spin');
                    if(playIcon) {
                        playIcon.classList.remove('fa-play');
                        playIcon.classList.add('fa-pause');
                    }
                    pInt = setInterval(() => {
                        if(progressBar && audio.duration) {
                            progressBar.style.width = (audio.currentTime/audio.duration)*100 + "%";
                        }
                    }, 100);
                })
                .catch(error => {
                    console.log("El navegador bloqueó el audio o ruta incorrecta:", error);
                });
            }
        }

        // 2. Animación visual de entrada
        enterScreen.style.opacity = '0';
        setTimeout(() => {
            enterScreen.style.display = 'none';
            mainLayout.classList.remove('hidden-layout');
            setTimeout(() => {
                document.querySelector('.nav-menu').classList.add('animate-buttons');
            }, 300);
            initTypewriter();
        }, 800);
    });

    // --- MAQUINA DE ESCRIBIR ---
    const welcomeMsg = "Eres mi amor para otra vida, mi amor para otra ocasión. Llegaste demasiado pronto y aun así fue tarde. Me entendías más que nadie, y no existía alguien, que te quisiera más que yo. Siempre he creído que todo es posible y que lo imposible...Solo tarda un poquito más. Pero querido amor imposible, contigo esa teoría está de más. A veces siento que fuimos impuntuales, o que el destino se haya encaprichado tanto con nosotros...Que decidió ponernos un minuto tarde. Tal vez una persona antes o una persona después fuimos todo y no fuimos nada.";
    function initTypewriter() {
        let i = 0;
        typingText.innerHTML = "";
        function type() {
            if (i < welcomeMsg.length) {
                typingText.innerHTML += welcomeMsg.charAt(i);
                i++;
                setTimeout(type, 50); 
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
            if(modalId === 'modal-gallery') {
                setTimeout(() => { updateGallery3D(); }, 50);
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

    // --- GALERÍA 3D ---
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

    if(carouselTrack) {
        carouselTrack.innerHTML = "";
        galleryImages.forEach((src, i) => {
            const card = document.createElement('div');
            card.className = 'card-3d-gold';
            card.innerHTML = `<img src="${src}" alt="Img ${i}" style="width:100%;height:100%;object-fit:cover;">`;
            card.onclick = () => { galleryIndex = i; updateGallery3D(); };
            carouselTrack.appendChild(card);
        });
    }

    window.updateGallery3D = () => {
        const cards = document.querySelectorAll('#carousel-3d-track .card-3d-gold');
        if(!cards.length) return;
        cards.forEach(c => c.classList.remove('active'));
        if(cards[galleryIndex]) cards[galleryIndex].classList.add('active');

        const container = document.querySelector('.gallery-container-3d');
        const containerWidth = container ? container.offsetWidth : 800;
        const cardWidth = cards[0].offsetWidth; 
        const cardMargin = 40; 
        const fullCardSpace = cardWidth + cardMargin;
        const centerPosition = (containerWidth / 2) - (galleryIndex * fullCardSpace) - (cardWidth / 2) - 20;

        carouselTrack.style.transform = `translateX(${centerPosition}px)`;
    };

    window.moveGallery = (dir) => {
        galleryIndex += dir;
        if(galleryIndex < 0) galleryIndex = galleryImages.length - 1;
        if(galleryIndex >= galleryImages.length) galleryIndex = 0;
        updateGallery3D();
    };

    // --- MÚSICA (LÓGICA DE CONTROL) ---
    const playlist = [
        { title: "BIRDS OF A FEATHER", artist: "Billie Eilish", src: "audio/Billie Eilish - BIRDS OF A FEATHER.mp3" },
    ];
    let sIdx = 0; let isPlaying = false; let pInt;

    function loadMusic(i) {
        if(!audio) return;
        audio.src = playlist[i].src;
        const titleEl = document.getElementById('song-title');
        const artistEl = document.getElementById('song-artist');
        if(titleEl) titleEl.innerText = playlist[i].title;
        if(artistEl) artistEl.innerText = playlist[i].artist;
    }
    
    // Esta función se usa para los botones del reproductor
    window.togglePlay = () => {
        if(isPlaying) {
            audio.pause(); isPlaying = false;
            if(vinyl) vinyl.classList.remove('vinyl-spin');
            if(playIcon) {
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
            }
            clearInterval(pInt);
        } else {
            audio.play();
            isPlaying = true;
            if(vinyl) vinyl.classList.add('vinyl-spin');
            if(playIcon) {
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
            }
            pInt = setInterval(() => {
                if(progressBar) progressBar.style.width = (audio.currentTime/audio.duration)*100 + "%";
            }, 100);
        }
    };
    
    window.nextSong = () => { 
        sIdx=(sIdx+1)%playlist.length; 
        loadMusic(sIdx); 
        // Si estaba sonando, que siga sonando
        if(isPlaying) { audio.play(); } 
    };
    window.prevSong = () => { 
        sIdx=(sIdx-1+playlist.length)%playlist.length; 
        loadMusic(sIdx); 
        if(isPlaying) { audio.play(); } 
    };
    
    // Carga inicial (pero no play automático, eso lo hace el botón ENTER)
    loadMusic(0);

    window.addEventListener('resize', () => {
        updateGallery3D();
    });
    /* --- BLOQUEAR INSPECCIONAR Y BOTÓN DERECHO --- */

// 1. Bloquear Click Derecho
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 2. Bloquear Teclas de Desarrollo (F12, Ctrl+Shift+I, Ctrl+U, etc)
document.addEventListener('keydown', (e) => {
    // Bloquear F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    
    // Bloquear Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Consola e Inspector)
    if (e.ctrlKey && e.shiftKey && 
       (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) {
        e.preventDefault();
        return false;
    }
    
    // Bloquear Ctrl+U (Ver código fuente)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        return false;
    }
});

