/**
 * White Phone OS - Web Animations API Wrapper
 * Spring physics and advanced animations
 */

/**
 * Spring physics configuration presets
 */
export const SpringPresets = {
    // Gentle, smooth spring
    gentle: {
        damping: 25,
        stiffness: 200,
        mass: 1
    },
    // Bouncy, playful spring
    bouncy: {
        damping: 15,
        stiffness: 300,
        mass: 0.8
    },
    // Snappy, quick response
    snappy: {
        damping: 30,
        stiffness: 400,
        mass: 0.6
    },
    // Wobbly, exaggerated
    wobbly: {
        damping: 10,
        stiffness: 250,
        mass: 1.2
    },
    // Stiff, minimal bounce
    stiff: {
        damping: 35,
        stiffness: 500,
        mass: 0.5
    }
};

/**
 * Calculate spring easing
 * @param {number} t - Time (0-1)
 * @param {Object} config - Spring configuration
 * @returns {number} Eased value
 */
export function springEasing(t, config = SpringPresets.gentle) {
    const { damping, stiffness, mass } = config;
    const c = damping;
    const k = stiffness;
    const m = mass;

    const w0 = Math.sqrt(k / m);
    const zeta = c / (2 * Math.sqrt(k * m));

    if (zeta < 1) {
        // Underdamped - bouncy
        const wd = w0 * Math.sqrt(1 - zeta * zeta);
        return 1 - Math.exp(-zeta * w0 * t) *
            (Math.cos(wd * t) + (zeta * w0 / wd) * Math.sin(wd * t));
    } else if (zeta === 1) {
        // Critically damped - perfect
        return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
    } else {
        // Overdamped - slow
        const r1 = -w0 * (zeta - Math.sqrt(zeta * zeta - 1));
        const r2 = -w0 * (zeta + Math.sqrt(zeta * zeta - 1));
        return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
    }
}

/**
 * Animate element with spring physics
 * @param {HTMLElement} element - Target element
 * @param {Object} keyframes - Animation keyframes
 * @param {Object} options - Animation options
 * @returns {Animation} Web Animation instance
 */
export function springAnimate(element, keyframes, options = {}) {
    const {
        duration = 500,
        spring = SpringPresets.gentle,
        fill = 'forwards',
        easing = 'linear'
    } = options;

    // For now, use cubic-bezier approximation
    // In production, you could calculate exact spring curve
    const springEase = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

    return element.animate(keyframes, {
        duration,
        easing: springEase,
        fill,
        ...options
    });
}

/**
 * View Transitions API wrapper with fallback
 * @param {Function} updateCallback - DOM update function
 * @returns {Promise} Transition completion promise
 */
export async function viewTransition(updateCallback) {
    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
        // Fallback: just run the update
        updateCallback();
        return Promise.resolve();
    }

    const transition = document.startViewTransition(() => {
        updateCallback();
    });

    return transition.finished;
}

/**
 * Animate with requestAnimationFrame for smooth 60fps
 * @param {Function} callback - Animation callback (receives progress 0-1)
 * @param {number} duration - Animation duration in ms
 * @returns {Object} Controller with cancel method
 */
export function rafAnimate(callback, duration = 300) {
    let startTime = null;
    let rafId = null;
    let cancelled = false;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (!cancelled) {
            callback(progress);
        }

        if (progress < 1 && !cancelled) {
            rafId = requestAnimationFrame(step);
        }
    }

    rafId = requestAnimationFrame(step);

    return {
        cancel: () => {
            cancelled = true;
            if (rafId) cancelAnimationFrame(rafId);
        }
    };
}

/**
 * Stagger animations for multiple elements
 * @param {Array<HTMLElement>} elements - Elements to animate
 * @param {Object} keyframes - Animation keyframes
 * @param {Object} options - Animation options
 * @returns {Array<Animation>} Array of animations
 */
export function staggerAnimate(elements, keyframes, options = {}) {
    const {
        stagger = 50,
        duration = 300,
        easing = 'cubic-bezier(0.4, 0, 0.2, 1)'
    } = options;

    return elements.map((element, index) => {
        return element.animate(keyframes, {
            duration,
            easing,
            delay: index * stagger,
            fill: 'forwards'
        });
    });
}

/**
 * Morph animation between two elements
 * @param {HTMLElement} from - Source element
 * @param {HTMLElement} to - Target element
 * @param {number} duration - Animation duration
 */
export function morphElements(from, to, duration = 400) {
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();

    const deltaX = toRect.left - fromRect.left;
    const deltaY = toRect.top - fromRect.top;
    const deltaW = toRect.width / fromRect.width;
    const deltaH = toRect.height / fromRect.height;

    return from.animate([
        {
            transform: 'translate(0, 0) scale(1, 1)',
            opacity: 1
        },
        {
            transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`,
            opacity: 0
        }
    ], {
        duration,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fill: 'forwards'
    });
}

/**
 * Parallax effect based on mouse/scroll
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Parallax options
 */
export function createParallax(element, options = {}) {
    const {
        strength = 20,
        type = 'mouse' // 'mouse' or 'scroll'
    } = options;

    if (type === 'mouse') {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * strength;
            const y = (e.clientY / window.innerHeight - 0.5) * strength;
            element.style.transform = `translate(${x}px, ${y}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => window.removeEventListener('mousemove', handleMouseMove);
    } else {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const y = scrollY * (strength / 100);
            element.style.transform = `translateY(${y}px)`;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }
}

/**
 * Entrance animation for elements
 * @param {HTMLElement} element - Element to animate
 * @param {string} type - Animation type ('fadeUp', 'scale', 'slide')
 */
export function entrance(element, type = 'fadeUp') {
    const animations = {
        fadeUp: [
            { opacity: 0, transform: 'translateY(30px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ],
        scale: [
            { opacity: 0, transform: 'scale(0.8)' },
            { opacity: 1, transform: 'scale(1)' }
        ],
        slideLeft: [
            { opacity: 0, transform: 'translateX(100%)' },
            { opacity: 1, transform: 'translateX(0)' }
        ],
        slideRight: [
            { opacity: 0, transform: 'translateX(-100%)' },
            { opacity: 1, transform: 'translateX(0)' }
        ]
    };

    return element.animate(animations[type] || animations.fadeUp, {
        duration: 400,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fill: 'forwards'
    });
}

/**
 * Exit animation for elements
 * @param {HTMLElement} element - Element to animate
 * @param {string} type - Animation type
 */
export function exit(element, type = 'fadeDown') {
    const animations = {
        fadeDown: [
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(30px)' }
        ],
        scale: [
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(0.8)' }
        ],
        slideLeft: [
            { opacity: 1, transform: 'translateX(0)' },
            { opacity: 0, transform: 'translateX(-100%)' }
        ],
        slideRight: [
            { opacity: 1, transform: 'translateX(0)' },
            { opacity: 0, transform: 'translateX(100%)' }
        ]
    };

    return element.animate(animations[type] || animations.fadeDown, {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
        fill: 'forwards'
    });
}

/**
 * Haptic feedback simulation (visual only, no actual vibration)
 * @param {HTMLElement} element - Element to animate
 * @param {string} intensity - 'light', 'medium', 'heavy'
 */
export function hapticFeedback(element, intensity = 'light') {
    const scales = {
        light: [1, 0.97, 1],
        medium: [1, 0.94, 1],
        heavy: [1, 0.90, 1]
    };

    const durations = {
        light: 100,
        medium: 150,
        heavy: 200
    };

    element.animate([
        { transform: `scale(${scales[intensity][0]})` },
        { transform: `scale(${scales[intensity][1]})` },
        { transform: `scale(${scales[intensity][2]})` }
    ], {
        duration: durations[intensity],
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
}
