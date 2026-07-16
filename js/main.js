// Stackly Main JavaScript File
document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Fadeout
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 600);
        });
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 3000);
    }

    // 2. Sticky Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 3. Mobile Navigation Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }

    // 4. Input validation and Redirecting Unwanted Links to 404
    const logoLink = document.querySelector('.logo');
    if (logoLink) {
        logoLink.setAttribute('href', 'index.html');
    }

    const allLinks = document.querySelectorAll('a, button');
    allLinks.forEach(elem => {
        const href = elem.getAttribute('href');
        const isNav = href && (
            href.includes('index.html') || 
            href.includes('about.html') || 
            href.includes('services.html') || 
            href.includes('features.html') || 
            href.includes('pricing.html') || 
            href.includes('contact.html') || 
            href.includes('login.html') || 
            href.includes('signup.html') ||
            href.includes('client-dashboard.html') ||
            href.includes('admin-dashboard.html') ||
            href.startsWith('#')
        );

        if (elem.tagName === 'A' && !isNav && href !== null && href !== '') {
            elem.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '404.html';
            });
        }
    });

    // Form Validator Setup
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            inputs.forEach(input => {
                const parent = input.closest('.form-group') || input.parentElement;
                let errorMsg = parent.querySelector('.error-message');
                
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    parent.appendChild(errorMsg);
                }

                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--accent)';
                    errorMsg.textContent = `${input.placeholder || 'This field'} is required.`;
                    errorMsg.style.display = 'block';
                } else if (input.type === 'email' && !validateEmail(input.value)) {
                    isValid = false;
                    input.style.borderColor = 'var(--accent)';
                    errorMsg.textContent = 'Please enter a valid email address.';
                    errorMsg.style.display = 'block';
                } else {
                    input.style.borderColor = 'var(--border-color)';
                    errorMsg.style.display = 'none';
                }

                input.addEventListener('input', () => {
                    input.style.borderColor = 'var(--border-color)';
                    errorMsg.style.display = 'none';
                });
            });

            if (isValid) {
                const emailInput = form.querySelector('input[type="email"]');
                if (emailInput) {
                    localStorage.setItem('stackly_user_email', emailInput.value);
                }
                
                const action = form.getAttribute('data-action');
                if (action) {
                    window.location.href = action;
                } else {
                    window.location.href = '404.html';
                }
            }
        });
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // 5. Interactive ROI Calculator (Home page)
    const roiSlider = document.getElementById('roi-tasks');
    const roiOutput = document.getElementById('roi-value');
    if (roiSlider && roiOutput) {
        roiSlider.addEventListener('input', () => {
            const tasks = parseInt(roiSlider.value);
            const tasksCount = document.getElementById('tasks-count');
            if (tasksCount) tasksCount.innerText = tasks;
            
            const timeSaved = tasks * 18; // minutes
            const hours = timeSaved / 60;
            const savings = Math.round(hours * 4000); // Converting to INR savings rate
            
            roiOutput.innerText = '₹' + savings.toLocaleString('en-IN');
        });
    }

    // 6. Testimonial Carousel (Home page)
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-btn.next');
        const prevButton = document.querySelector('.carousel-btn.prev');
        let currentIndex = 0;

        const updateCarousel = () => {
            if (slides.length > 0) {
                const width = slides[0].getBoundingClientRect().width;
                track.style.transform = 'translateX(-' + (currentIndex * (width + 20)) + 'px)';
            }
        };

        if (nextButton && prevButton) {
            nextButton.addEventListener('click', () => {
                if (currentIndex < slides.length - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarousel();
            });

            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = slides.length - 1;
                }
                updateCarousel();
            });
        }

        setInterval(() => {
            if (slides.length > 0) {
                if (currentIndex < slides.length - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarousel();
            }
        }, 5000);

        window.addEventListener('resize', updateCarousel);
    }

    // 7. Pricing Monthly/Yearly toggle
    const planToggle = document.getElementById('billing-toggle');
    const prices = document.querySelectorAll('.plan-price');
    if (planToggle && prices.length > 0) {
        planToggle.addEventListener('change', () => {
            prices.forEach(price => {
                const monthlyPrice = parseInt(price.getAttribute('data-monthly'));
                const yearlyPrice = Math.round((monthlyPrice * 12 * 0.8) / 12);
                
                if (planToggle.checked) {
                    price.innerHTML = `₹${yearlyPrice.toLocaleString('en-IN')}<span>/mo</span>`;
                } else {
                    price.innerHTML = `₹${monthlyPrice.toLocaleString('en-IN')}<span>/mo</span>`;
                }
            });
        });
    }

    // 8. Custom Date Time Picker
    const dtPicker = document.querySelector('.custom-dt-picker');
    if (dtPicker) {
        const dateInput = dtPicker.querySelector('.date-select');
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (dateInput) {
            dateInput.value = tomorrow.toISOString().substring(0, 10);
            dateInput.min = today.toISOString().substring(0, 10);
        }
    }

    // 9. Countdown Timer
    const countdown = document.getElementById('countdown-timer');
    if (countdown) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 14);

        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            const daysVal = document.getElementById('cd-days');
            const hoursVal = document.getElementById('cd-hours');
            const minutesVal = document.getElementById('cd-minutes');
            const secondsVal = document.getElementById('cd-seconds');

            if (daysVal) daysVal.innerText = days < 10 ? '0' + days : days;
            if (hoursVal) hoursVal.innerText = hours < 10 ? '0' + hours : hours;
            if (minutesVal) minutesVal.innerText = minutes < 10 ? '0' + minutes : minutes;
            if (secondsVal) secondsVal.innerText = seconds < 10 ? '0' + seconds : seconds;
        };

        setInterval(updateTimer, 1000);
        updateTimer();
    }

    // 10. FAQ Accordions
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-question');
        if (header) {
            header.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        }
    });

    // 11. Custom 3D Abstract Metallic/Glass Fluid Object (Replicating the Allyvera center icon)
    const canvas = document.getElementById('sphere-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        if (width < 50) width = 500;
        if (height < 50) height = 500;
        canvas.width = width;
        canvas.height = height;

        window.addEventListener('resize', () => {
            let newWidth = canvas.offsetWidth;
            let newHeight = canvas.offsetHeight;
            if (newWidth > 50 && newHeight > 50) {
                width = canvas.width = newWidth;
                height = canvas.height = newHeight;
            }
        });

        let angleX = 0.005;
        let angleY = 0.008;
        let tOffset = 0;

        function drawFluidKnot() {
            ctx.clearRect(0, 0, width, height);
            tOffset += 0.015;

            // Center glow backing
            const backGlow = ctx.createRadialGradient(width/2, height/2, 5, width/2, height/2, Math.min(width, height) * 0.35);
            backGlow.addColorStop(0, 'rgba(157, 78, 221, 0.28)');
            backGlow.addColorStop(0.5, 'rgba(255, 0, 127, 0.1)');
            backGlow.addColorStop(1, 'rgba(10, 4, 26, 0)');
            ctx.fillStyle = backGlow;
            ctx.beginPath();
            ctx.arc(width/2, height/2, Math.min(width, height) * 0.45, 0, Math.PI * 2);
            ctx.fill();

            // Draw multiple overlapping twisted organic ribbons
            const ribbonCount = 8;
            ctx.lineWidth = 5.5;
            ctx.shadowBlur = 15;
            
            for (let r = 0; r < ribbonCount; r++) {
                const rOffset = (r / ribbonCount) * Math.PI * 2;
                const points = [];
                const stepCount = 120;
                
                for (let s = 0; s <= stepCount; s++) {
                    const theta = (s / stepCount) * Math.PI * 2;
                    
                    // Complex 3D parametric equations generating organic curves resembling the screenshot's center art
                    const rad = Math.min(width, height) * 0.26 * (1 + 0.35 * Math.sin(theta * 3 + tOffset + rOffset));
                    const x3d = rad * Math.cos(theta);
                    const y3d = rad * Math.sin(theta);
                    const z3d = rad * Math.cos(theta * 2 + tOffset * 1.5);

                    // Rotate the ribbon point
                    const cosX = Math.cos(angleX * s * 0.05);
                    const sinX = Math.sin(angleX * s * 0.05);
                    const cosY = Math.cos(angleY * s * 0.05 + tOffset * 0.1);
                    const sinY = Math.sin(angleY * s * 0.05 + tOffset * 0.1);

                    let x1 = x3d * cosY - z3d * sinY;
                    let z1 = z3d * cosY + x3d * sinY;
                    let y1 = y3d * cosX - z1 * sinX;
                    let z2 = z1 * cosX + y3d * sinX;

                    const fov = 400;
                    const scale = fov / (fov + z2);
                    const x2d = (x1 * scale) + width / 2;
                    const y2d = (y1 * scale) + height / 2;
                    points.push({ x: x2d, y: y2d });
                }

                // Add drop shadow matching current ribbon color to simulate metallic glowing depth
                ctx.shadowColor = r % 2 === 0 ? 'rgba(0, 255, 255, 0.4)' : 'rgba(255, 0, 127, 0.4)';

                const strokeGrad = ctx.createLinearGradient(width/2 - 150, height/2 - 150, width/2 + 150, height/2 + 150);
                strokeGrad.addColorStop(0, '#00ffff');
                strokeGrad.addColorStop(0.5, '#9d4edd');
                strokeGrad.addColorStop(1, '#ff007f');
                ctx.strokeStyle = strokeGrad;

                ctx.beginPath();
                points.forEach((p, idx) => {
                    if (idx === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
                ctx.stroke();
            }

            // Reset shadows for other canvas drawings
            ctx.shadowBlur = 0;
            requestAnimationFrame(drawFluidKnot);
        }

        drawFluidKnot();
    }
});
