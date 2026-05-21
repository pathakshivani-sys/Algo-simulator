/**
 * Interactive Particle System
 * - Particles float and drift
 * - Mouse cursor repels nearby particles
 * - Nearby particles draw connection lines
 * - Click creates a burst of new particles
 */
export function initParticles(canvasId) {
  const canvas = document.createElement('canvas');
  canvas.id = canvasId + '-canvas';
  canvas.style.cssText = `
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    width: 100%; height: 100%;
  `;
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const mouse = { x: -9999, y: -9999 };
  const CONNECT_DIST  = 130;
  const REPEL_DIST    = 90;
  const REPEL_FORCE   = 4;
  const MAX_PARTICLES = 120;
  const COLORS = ['#06b6d4', '#8b5cf6', '#fbbf24', '#10b981', '#f472b6'];

  class Particle {
    constructor(x, y, burst = false) {
      this.x  = x ?? Math.random() * W;
      this.y  = y ?? Math.random() * H;
      this.vx = (Math.random() - 0.5) * (burst ? 4 : 0.6);
      this.vy = (Math.random() - 0.5) * (burst ? 4 : 0.6);
      this.r  = burst ? Math.random() * 3 + 1 : Math.random() * 2.5 + 0.8;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = burst ? 1 : Math.random() * 0.5 + 0.2;
      this.burst = burst;
      this.life  = burst ? 1 : Infinity;
      this.decay = burst ? Math.random() * 0.02 + 0.01 : 0;
    }
    update() {
      // Repel from mouse
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < REPEL_DIST && dist > 0) {
        const force = (REPEL_DIST - dist) / REPEL_DIST * REPEL_FORCE;
        this.vx += (dx / dist) * force * 0.05;
        this.vy += (dy / dist) * force * 0.05;
      }
      // Friction
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x  += this.vx;
      this.y  += this.vy;
      // Wrap around edges (non-burst)
      if (!this.burst) {
        if (this.x < 0)  this.x = W;
        if (this.x > W)  this.x = 0;
        if (this.y < 0)  this.y = H;
        if (this.y > H)  this.y = 0;
      }
      // Decay burst particles
      if (this.burst) {
        this.alpha -= this.decay;
        this.life   = this.alpha;
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  let particles = Array.from({ length: 80 }, () => new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.hypot(dx, dy);
        if (d < CONNECT_DIST) {
          const opacity = (1 - d / CONNECT_DIST) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = a.color;
          ctx.globalAlpha = opacity;
          ctx.lineWidth   = 0.6;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // Remove dead burst particles
    particles = particles.filter(p => !p.burst || p.life > 0);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();

  // Mouse move – update position (on window so it tracks outside canvas)
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  // Touch support
  window.addEventListener('touchmove', e => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true });

  // Click burst
  window.addEventListener('click', e => {
    const count = Math.min(18, MAX_PARTICLES - particles.length + 18);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(e.clientX, e.clientY, true));
    }
  });

  // Resize
  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}
