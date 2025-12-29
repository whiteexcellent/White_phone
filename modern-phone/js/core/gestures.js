/**
 * White Phone OS - Gesture Detection
 * Touch Events API for swipe, pinch, long press, etc.
 */

/**
 * Gesture detector class
 */
export class GestureDetector {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            swipeThreshold: 50,      // Minimum distance for swipe
            swipeTimeout: 300,       // Maximum time for swipe
            longPressTimeout: 500,   // Time for long press
            pinchThreshold: 0.1,     // Minimum scale change for pinch
            ...options
        };

        this.handlers = {};
        this.touchStart = null;
        this.touchCurrent = null;
        this.touchStartTime = 0;
        this.longPressTimer = null;
        this.isPinching = false;
        this.initialPinchDistance = 0;

        this.bindEvents();
    }

    /**
     * Bind touch/mouse events
     */
    bindEvents() {
        // Touch events
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

        // Mouse events fallback
        this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.element.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    /**
     * Register event handler
     * @param {string} event - Event name ('swipeUp', 'swipeDown', 'tap', etc.)
     * @param {Function} handler - Handler function
     */
    on(event, handler) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler);
        return this;
    }

    /**
     * Emit event
     */
    emit(event, data = {}) {
        if (this.handlers[event]) {
            this.handlers[event].forEach(handler => handler(data));
        }
    }

    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            // Single touch
            this.touchStart = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
            this.touchStartTime = Date.now();

            // Start long press timer
            this.longPressTimer = setTimeout(() => {
                this.emit('longPress', {
                    x: this.touchStart.x,
                    y: this.touchStart.y
                });
            }, this.options.longPressTimeout);

        } else if (e.touches.length === 2) {
            // Pinch start
            this.isPinching = true;
            this.initialPinchDistance = this.getPinchDistance(e.touches);
            this.clearLongPressTimer();
        }
    }

    /**
     * Handle touch move
     */
    handleTouchMove(e) {
        if (this.isPinching && e.touches.length === 2) {
            // Pinch gesture
            const currentDistance = this.getPinchDistance(e.touches);
            const scale = currentDistance / this.initialPinchDistance;

            this.emit('pinch', {
                scale,
                distance: currentDistance
            });
        } else if (e.touches.length === 1 && this.touchStart) {
            // Swipe gesture
            this.touchCurrent = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };

            const deltaX = this.touchCurrent.x - this.touchStart.x;
            const deltaY = this.touchCurrent.y - this.touchStart.y;

            this.emit('drag', {
                deltaX,
                deltaY,
                currentX: this.touchCurrent.x,
                currentY: this.touchCurrent.y
            });

            // Cancel long press if moved too much
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (distance > 10) {
                this.clearLongPressTimer();
            }
        }
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        this.clearLongPressTimer();

        if (this.isPinching) {
            this.isPinching = false;
            this.emit('pinchEnd', {});
            return;
        }

        if (!this.touchStart || !this.touchCurrent) {
            // Tap
            if (this.touchStart && Date.now() - this.touchStartTime < 200) {
                this.emit('tap', {
                    x: this.touchStart.x,
                    y: this.touchStart.y
                });
            }
            this.reset();
            return;
        }

        const deltaX = this.touchCurrent.x - this.touchStart.x;
        const deltaY = this.touchCurrent.y - this.touchStart.y;
        const duration = Date.now() - this.touchStartTime;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Calculate velocity
        const velocity = distance / duration;

        // Detect swipe
        if (distance >= this.options.swipeThreshold &&
            duration <= this.options.swipeTimeout) {

            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            if (absX > absY) {
                // Horizontal swipe
                if (deltaX > 0) {
                    this.emit('swipeRight', { distance, velocity, deltaX, deltaY });
                } else {
                    this.emit('swipeLeft', { distance, velocity, deltaX, deltaY });
                }
            } else {
                // Vertical swipe
                if (deltaY > 0) {
                    this.emit('swipeDown', { distance, velocity, deltaX, deltaY });
                } else {
                    this.emit('swipeUp', { distance, velocity, deltaX, deltaY });
                }
            }
        }

        this.emit('dragEnd', { deltaX, deltaY, velocity });
        this.reset();
    }

    /**
     * Mouse event handlers (fallback)
     */
    handleMouseDown(e) {
        const touch = {
            touches: [{
                clientX: e.clientX,
                clientY: e.clientY
            }]
        };
        this.handleTouchStart(touch);
    }

    handleMouseMove(e) {
        if (!this.touchStart) return;

        const touch = {
            touches: [{
                clientX: e.clientX,
                clientY: e.clientY
            }]
        };
        this.handleTouchMove(touch);
    }

    handleMouseUp(e) {
        this.handleTouchEnd({});
    }

    /**
     * Get distance between two touch points
     */
    getPinchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Clear long press timer
     */
    clearLongPressTimer() {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }

    /**
     * Reset state
     */
    reset() {
        this.touchStart = null;
        this.touchCurrent = null;
        this.touchStartTime = 0;
    }

    /**
     * Destroy gesture detector
     */
    destroy() {
        this.clearLongPressTimer();
        this.element.removeEventListener('touchstart', this.handleTouchStart);
        this.element.removeEventListener('touchmove', this.handleTouchMove);
        this.element.removeEventListener('touchend', this.handleTouchEnd);
        this.element.removeEventListener('mousedown', this.handleMouseDown);
        this.element.removeEventListener('mousemove', this.handleMouseMove);
        this.element.removeEventListener('mouseup', this.handleMouseUp);
    }
}

/**
 * Helper function to create gesture detector
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Options
 * @returns {GestureDetector} Detector instance
 */
export function createGestureDetector(element, options) {
    return new GestureDetector(element, options);
}

/**
 * Swipe detection helper
 * @param {HTMLElement} element - Element to detect swipes on
 * @param {Object} handlers - Swipe handlers (onSwipeUp, onSwipeDown, etc.)
 * @returns {GestureDetector} Detector instance
 */
export function setupSwipeDetection(element, handlers = {}) {
    const detector = new GestureDetector(element);

    if (handlers.onSwipeUp) detector.on('swipeUp', handlers.onSwipeUp);
    if (handlers.onSwipeDown) detector.on('swipeDown', handlers.onSwipeDown);
    if (handlers.onSwipeLeft) detector.on('swipeLeft', handlers.onSwipeLeft);
    if (handlers.onSwipeRight) detector.on('swipeRight', handlers.onSwipeRight);
    if (handlers.onTap) detector.on('tap', handlers.onTap);
    if (handlers.onLongPress) detector.on('longPress', handlers.onLongPress);

    return detector;
}
