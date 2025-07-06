// Neural Studio JavaScript - Original Interactive Experience
class NeuralStudio {
    constructor() {
        this.currentSection = 'home';
        this.neuralActive = true;
        this.soundEnabled = false;
        this.loadingProgress = 0;
        this.init();
    }

    init() {
        this.setupLoadingSequence();
        this.setupNeuralBackground();
        this.setupNavigation();
        this.setupControls();
        this.setupStatusDisplay();
        this.setupAnimations();
        this.setupInteractiveElements();
    }

    // Loading Sequence
    setupLoadingSequence() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainInterface = document.getElementById('main-interface');
        const nodes = document.querySelectorAll('.progress-nodes .node');
        const statusText = document.getElementById('loading-status');
        const percentText = document.getElementById('loading-percent');
        const enterBtn = document.getElementById('enter-neural');

        const loadingMessages = [
            'Connecting to AI Network...',
            'Initializing Neural Pathways...',
            'Loading Creative Algorithms...',
            'Establishing Data Streams...',
            'Neural Studio Ready!'
        ];

        let currentNode = 0;
        const progressInterval = setInterval(() => {
            this.loadingProgress += Math.random() * 20 + 5;
            
            if (this.loadingProgress >= 100) {
                this.loadingProgress = 100;
                clearInterval(progressInterval);
                statusText.textContent = loadingMessages[4];
                
                setTimeout(() => {
                    enterBtn.style.display = 'inline-flex';
                    enterBtn.style.animation = 'logoFloat 2s ease-in-out infinite';
                }, 500);
            } else {
                // Activate nodes progressively
                const nodeIndex = Math.floor((this.loadingProgress / 100) * nodes.length);
                if (nodeIndex > currentNode && nodeIndex < nodes.length) {
                    nodes[nodeIndex].classList.add('active');
                    statusText.textContent = loadingMessages[nodeIndex] || loadingMessages[0];
                    currentNode = nodeIndex;
                    this.playNeuralSound('activate');
                }
            }
            
            percentText.textContent = `${Math.floor(this.loadingProgress)}%`;
        }, 300);

        // Enter Neural Space
        enterBtn.addEventListener('click', () => {
            this.playNeuralSound('enter');
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainInterface.style.display = 'block';
                this.startNeuralExperience();
            }, 1000);
        });
    }

    // Neural Background Animation
    setupNeuralBackground() {
        const canvas = document.getElementById('neural-canvas');
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Neural Network Nodes
        const nodes = [];
        const connections = [];
        const nodeCount = 50;
        
        // Initialize nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 4 + 2,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.02,
                connections: []
            });
        }

        // Create connections between nearby nodes
        const createConnections = () => {
            connections.length = 0;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        connections.push({
                            from: i,
                            to: j,
                            opacity: Math.max(0, 1 - distance / 150),
                            pulse: Math.random() * Math.PI * 2
                        });
                    }
                }
            }
        };

        createConnections();

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (!this.neuralActive) {
                requestAnimationFrame(animate);
                return;
            }

            // Update and draw connections
            connections.forEach(connection => {
                const nodeA = nodes[connection.from];
                const nodeB = nodes[connection.to];
                
                connection.pulse += 0.05;
                const pulseIntensity = Math.sin(connection.pulse) * 0.5 + 0.5;
                
                ctx.beginPath();
                ctx.moveTo(nodeA.x, nodeA.y);
                ctx.lineTo(nodeB.x, nodeB.y);
                
                const gradient = ctx.createLinearGradient(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
                gradient.addColorStop(0, `rgba(139, 69, 19, ${connection.opacity * pulseIntensity * 0.6})`);
                gradient.addColorStop(0.5, `rgba(255, 215, 0, ${connection.opacity * pulseIntensity * 0.8})`);
                gradient.addColorStop(1, `rgba(101, 67, 33, ${connection.opacity * pulseIntensity * 0.6})`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // Update and draw nodes
            nodes.forEach(node => {
                // Update position
                node.x += node.vx;
                node.y += node.vy;
                
                // Bounce off edges
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
                
                // Keep within bounds
                node.x = Math.max(0, Math.min(canvas.width, node.x));
                node.y = Math.max(0, Math.min(canvas.height, node.y));
                
                // Update pulse
                node.pulse += node.pulseSpeed;
                const pulseSize = Math.sin(node.pulse) * 2 + node.size;
                const pulseOpacity = Math.sin(node.pulse) * 0.3 + 0.7;
                
                // Draw node
                ctx.beginPath();
                ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
                
                const nodeGradient = ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, pulseSize
                );
                nodeGradient.addColorStop(0, `rgba(255, 215, 0, ${pulseOpacity})`);
                nodeGradient.addColorStop(0.7, `rgba(139, 69, 19, ${pulseOpacity * 0.5})`);
                nodeGradient.addColorStop(1, 'rgba(139, 69, 19, 0)');
                
                ctx.fillStyle = nodeGradient;
                ctx.fill();
            });
            
            // Recreate connections periodically
            if (Math.random() < 0.01) {
                createConnections();
            }
            
            requestAnimationFrame(animate);
        };

        animate();
    }

    // Navigation System
    setupNavigation() {
        const navNodes = document.querySelectorAll('.nav-node');
        const contentPanels = document.querySelectorAll('.content-panel');

        navNodes.forEach(node => {
            node.addEventListener('click', () => {
                const targetSection = node.getAttribute('data-section');
                this.switchSection(targetSection);
                this.playNeuralSound('navigate');
                
                // Update nav active state
                navNodes.forEach(n => n.classList.remove('active'));
                node.classList.add('active');
                
                // Add neural pulse effect
                this.addNeuralPulse(node);
            });
        });
    }

    switchSection(sectionId) {
        const contentPanels = document.querySelectorAll('.content-panel');
        
        // Hide all panels
        contentPanels.forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Show target panel with delay for animation
        setTimeout(() => {
            const targetPanel = document.getElementById(sectionId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                this.currentSection = sectionId;
                
                // Trigger section-specific animations
                this.triggerSectionAnimations(sectionId);
            }
        }, 100);
    }

    // Controls
    setupControls() {
        const themeToggle = document.getElementById('theme-toggle');
        const neuralToggle = document.getElementById('neural-toggle');
        const soundToggle = document.getElementById('sound-toggle');

        // Theme toggle (placeholder for future implementation)
        themeToggle.addEventListener('click', () => {
            this.playNeuralSound('control');
            this.addNeuralPulse(themeToggle);
            // Future: implement theme switching
        });

        // Neural background toggle
        neuralToggle.addEventListener('click', () => {
            this.neuralActive = !this.neuralActive;
            this.playNeuralSound('control');
            this.addNeuralPulse(neuralToggle);
            
            const canvas = document.getElementById('neural-canvas');
            canvas.style.opacity = this.neuralActive ? '0.6' : '0.1';
        });

        // Sound toggle
        soundToggle.addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            const icon = soundToggle.querySelector('.material-symbols-outlined');
            icon.textContent = this.soundEnabled ? 'volume_up' : 'volume_off';
            this.addNeuralPulse(soundToggle);
            
            if (this.soundEnabled) {
                this.playNeuralSound('enable');
            }
        });
    }

    // Status Display
    setupStatusDisplay() {
        const timeDisplay = document.getElementById('neural-time');
        
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timeDisplay.textContent = timeString;
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Animations
    setupAnimations() {
        // Hexagon stats counter
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const hexagon = entry.target;
                    const targetValue = parseInt(hexagon.getAttribute('data-value'));
                    const numberElement = hexagon.querySelector('.stat-number');
                    
                    if (numberElement && !numberElement.classList.contains('counted')) {
                        this.animateCounter(numberElement, targetValue);
                        numberElement.classList.add('counted');
                        this.addNeuralPulse(hexagon);
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stat-hexagon').forEach(hex => {
            observer.observe(hex);
        });
    }

    animateCounter(element, targetValue) {
        const originalText = element.textContent;
        const suffix = originalText.replace(/\d+/, '');
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(targetValue * easeOut);
            
            element.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    // Interactive Elements
    setupInteractiveElements() {
        // Neural buttons
        document.querySelectorAll('.neural-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.playNeuralSound('hover');
            });
            
            btn.addEventListener('click', () => {
                this.playNeuralSound('click');
                this.addNeuralPulse(btn);
            });
        });

        // Hoverable cards
        document.querySelectorAll('.stream-card, .access-card, .connection-node').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addGlowEffect(card);
                this.playNeuralSound('hover');
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeGlowEffect(card);
            });
        });

        // Hexagon stats
        document.querySelectorAll('.stat-hexagon').forEach(hex => {
            hex.addEventListener('click', () => {
                this.addNeuralPulse(hex);
                this.playNeuralSound('activate');
            });
        });
    }

    // Section-specific animations
    triggerSectionAnimations(sectionId) {
        switch (sectionId) {
            case 'home':
                this.animateHeroElements();
                break;
            case 'concept':
                this.animateConceptCards();
                break;
            case 'content':
                this.animateDataStreams();
                break;
            case 'plans':
                this.animateAccessCards();
                break;
            case 'contact':
                this.animateConnectionNodes();
                break;
        }
    }

    animateHeroElements() {
        const heroElements = document.querySelectorAll('#home .status-badge, #home .hero-subtitle, #home .hero-description');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.animation = 'panelSlideIn 0.6s ease-out';
            }, index * 200);
        });
    }

    animateConceptCards() {
        const conceptCards = document.querySelectorAll('.concept-card');
        conceptCards.forEach((card, index) => {
            setTimeout(() => {
                this.addNeuralPulse(card);
            }, index * 300);
        });
    }

    animateDataStreams() {
        const streamCards = document.querySelectorAll('.stream-card');
        streamCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(-5px)';
                this.addGlowEffect(card);
                setTimeout(() => {
                    card.style.transform = 'translateY(0)';
                    this.removeGlowEffect(card);
                }, 600);
            }, index * 200);
        });
    }

    animateAccessCards() {
        const accessCards = document.querySelectorAll('.access-card');
        accessCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'panelSlideIn 0.6s ease-out';
            }, index * 150);
        });
    }

    animateConnectionNodes() {
        const connectionNodes = document.querySelectorAll('.connection-node');
        connectionNodes.forEach((node, index) => {
            setTimeout(() => {
                this.addNeuralPulse(node);
            }, index * 200);
        });
    }

    // Neural Effects
    addNeuralPulse(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'nodeActivate 0.6s ease-in-out';
        }, 10);
    }

    addGlowEffect(element) {
        element.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)';
        element.style.borderColor = 'var(--neural-accent)';
    }

    removeGlowEffect(element) {
        element.style.boxShadow = '';
        element.style.borderColor = '';
    }

    // Neural Sound System
    playNeuralSound(type) {
        if (!this.soundEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Different sounds for different interactions
            const soundMap = {
                hover: { freq: 800, duration: 0.1 },
                click: { freq: 1200, duration: 0.2 },
                activate: { freq: 1600, duration: 0.3 },
                navigate: { freq: 2000, duration: 0.25 },
                control: { freq: 1400, duration: 0.15 },
                enter: { freq: 440, duration: 1.0 },
                enable: { freq: 880, duration: 0.4 }
            };
            
            const sound = soundMap[type] || soundMap.click;
            
            oscillator.frequency.setValueAtTime(sound.freq, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
                sound.freq * 0.5, 
                audioContext.currentTime + sound.duration
            );
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01, 
                audioContext.currentTime + sound.duration
            );
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + sound.duration);
            
        } catch (e) {
            // Fallback for browsers without Web Audio API
            console.log(`🔊 Neural ${type} sound`);
        }
    }

    // Neural Experience Startup
    startNeuralExperience() {
        // Welcome animation sequence
        const elements = document.querySelectorAll('.nav-node, .control-btn');
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.addNeuralPulse(element);
            }, index * 100);
        });

        // Start with home section
        this.switchSection('home');
        
        // Welcome message
        setTimeout(() => {
            this.showNeuralMessage('Neural Studio activated. Welcome to the creative network.');
        }, 1000);
    }

    showNeuralMessage(message) {
        console.log(`🧠 Neural Studio: ${message}`);
        
        // Could add a toast notification system here
        const notification = document.createElement('div');
        notification.className = 'neural-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, var(--neural-primary), var(--neural-secondary));
            color: var(--bg-dark);
            padding: 1rem 2rem;
            border-radius: 15px;
            font-family: var(--font-primary);
            font-weight: 600;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.4s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
}

// Initialize Neural Studio
document.addEventListener('DOMContentLoaded', () => {
    const neuralStudio = new NeuralStudio();
    
    // Global neural studio access
    window.neuralStudio = neuralStudio;
    
    // Console welcome message
    console.log(`
    ╔══════════════════════════════════════╗
    ║        AI NEURAL STUDIO v1.0        ║
    ║                                      ║
    ║  週刊！AIクリエイターズ・スタジオ      ║
    ║                                      ║
    ║  Neural Network: ████████████ ACTIVE ║
    ║  Creative Mode:  ████████████ ONLINE ║
    ║  Data Streams:   ████████████ STABLE ║
    ║                                      ║
    ║  > neural.activate()                 ║
    ║  > neural.connect()                  ║
    ║  > neural.create()                   ║
    ╚══════════════════════════════════════╝
    `);
    
    // Expose neural commands
    window.neural = {
        activate: () => neuralStudio.neuralActive = true,
        deactivate: () => neuralStudio.neuralActive = false,
        connect: (section) => neuralStudio.switchSection(section),
        sound: (enabled) => {
            neuralStudio.soundEnabled = enabled;
            const soundToggle = document.getElementById('sound-toggle');
            const icon = soundToggle.querySelector('.material-symbols-outlined');
            icon.textContent = enabled ? 'volume_up' : 'volume_off';
        },
        pulse: (selector) => {
            const element = document.querySelector(selector);
            if (element) neuralStudio.addNeuralPulse(element);
        },
        message: (msg) => neuralStudio.showNeuralMessage(msg)
    };
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.altKey) {
        const sections = ['home', 'concept', 'content', 'plans', 'contact'];
        const sectionIndex = parseInt(e.key) - 1;
        
        if (sectionIndex >= 0 && sectionIndex < sections.length) {
            e.preventDefault();
            window.neuralStudio.switchSection(sections[sectionIndex]);
            window.neural.message(`Switched to ${sections[sectionIndex]} section`);
        }
    }
    
    // Easter eggs
    if (e.key === 'Escape') {
        window.neuralStudio.switchSection('home');
    }
    
    if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        window.neural.message('Neural creativity mode activated! 🧠✨');
        document.querySelectorAll('.stat-hexagon').forEach(hex => {
            window.neuralStudio.addNeuralPulse(hex);
        });
    }
});

// Prevent context menu for immersive experience
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.neural-btn') || e.target.closest('.nav-node')) {
        e.preventDefault();
    }
});

// Performance monitoring
let frameCount = 0;
let lastTime = performance.now();

setInterval(() => {
    const currentTime = performance.now();
    const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
    frameCount = 0;
    lastTime = currentTime;
    
    if (fps < 30) {
        console.warn('Neural performance degraded:', fps, 'FPS');
    }
}, 1000);

requestAnimationFrame(function countFrames() {
    frameCount++;
    requestAnimationFrame(countFrames);
});