/* ======================================================================
   INet Lab — Animations engine
   Signature visual: an animated message-passing graph — nodes exchange
   pulses along edges, echoing the GNN / digital-twin work described
   in the lab's own research.
   ====================================================================== */

/* ---------------- Network canvas ---------------- */
function initNetworkCanvas(canvas, opts){
  if(!canvas) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  const options = Object.assign({
    nodeCount: 46,
    linkDist: 150,
    pulseChance: 0.006,
    color: '30,136,229',
    glow: '79,195,247'
  }, opts||{});

  let W, H, nodes = [], pulses = [], raf;

  function resize(){
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = rect.width * devicePixelRatio;
    H = canvas.height = rect.height * devicePixelRatio;
    canvas.style.width = rect.width+'px';
    canvas.style.height = rect.height+'px';
  }

  function makeNodes(){
    nodes = [];
    const count = Math.min(options.nodeCount, Math.floor((W*H)/(90000*devicePixelRatio)));
    for(let i=0;i<Math.max(count,18);i++){
      nodes.push({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-0.5)*0.18*devicePixelRatio,
        vy: (Math.random()-0.5)*0.18*devicePixelRatio,
        r: (Math.random()*1.6+1.4)*devicePixelRatio
      });
    }
  }

  function step(){
    ctx.clearRect(0,0,W,H);
    // move
    nodes.forEach(n=>{
      n.x += n.vx; n.y += n.vy;
      if(n.x<0||n.x>W) n.vx*=-1;
      if(n.y<0||n.y>H) n.vy*=-1;
    });
    // links
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i], b=nodes[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        const maxDist = options.linkDist*devicePixelRatio;
        if(dist < maxDist){
          const alpha = (1-dist/maxDist)*0.5;
          ctx.strokeStyle = `rgba(${options.color},${alpha})`;
          ctx.lineWidth = devicePixelRatio*0.7;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.stroke();
          if(!reduced && Math.random() < options.pulseChance){
            pulses.push({ a, b, t:0 });
          }
        }
      }
    }
    // nodes
    nodes.forEach(n=>{
      ctx.beginPath();
      ctx.fillStyle = `rgba(${options.glow},0.9)`;
      ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fill();
    });
    // pulses (message passing)
    pulses = pulses.filter(p => p.t < 1);
    pulses.forEach(p=>{
      p.t += 0.018;
      const x = p.a.x + (p.b.x-p.a.x)*p.t;
      const y = p.a.y + (p.b.y-p.a.y)*p.t;
      ctx.beginPath();
      ctx.fillStyle = '#FF7A45';
      ctx.arc(x,y,2.6*devicePixelRatio,0,Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,122,69,0.25)';
      ctx.arc(x,y,6*devicePixelRatio,0,Math.PI*2);
      ctx.fill();
    });

    raf = requestAnimationFrame(step);
  }

  resize();
  makeNodes();
  if(!reduced){ step(); } else {
    // draw a single static frame
    step(); cancelAnimationFrame(raf);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(()=>{ resize(); makeNodes(); }, 200);
  });
}

/* ---------------- Scroll reveal ---------------- */
function initScrollReveal(){
  const items = document.querySelectorAll('[data-reveal]');
  if(!items.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold:0.05, rootMargin:'0px 0px -5% 0px' });
  items.forEach((el,i)=>{
    el.style.transitionDelay = (Math.min(i%4,4)*80)+'ms';
    io.observe(el);
  });

  // Safety net: never leave content permanently invisible
  setTimeout(()=>{
    document.querySelectorAll('[data-reveal]:not(.in)').forEach(el=>el.classList.add('in'));
  }, 4000);
}

/* ---------------- Animated counters ---------------- */
function initCounters(){
  const counters = document.querySelectorAll('[data-count]');
  if(!counters.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const dur = 1400;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now-start)/dur, 1);
        const eased = 1 - Math.pow(1-p, 3);
        const val = target * eased;
        el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
        if(p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold:0.6 });
  counters.forEach(el=>io.observe(el));
}

/* ---------------- Card tilt ---------------- */
function initTilt(){
  const els = document.querySelectorAll('.tilt');
  els.forEach(el=>{
    el.addEventListener('mousemove', (e)=>{
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left)/r.width - 0.5;
      const y = (e.clientY - r.top)/r.height - 0.5;
      el.style.setProperty('--ry', (x*8)+'deg');
      el.style.setProperty('--rx', (-y*8)+'deg');
    });
    el.addEventListener('mouseleave', ()=>{
      el.style.setProperty('--rx','0deg');
      el.style.setProperty('--ry','0deg');
    });
  });
}

/* ---------------- Ripple buttons ---------------- */
function initRipple(){
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const span = document.createElement('span');
      span.className = 'ripple';
      span.style.left = (e.clientX-rect.left)+'px';
      span.style.top = (e.clientY-rect.top)+'px';
      span.style.width = span.style.height = Math.max(rect.width,rect.height)+'px';
      this.appendChild(span);
      setTimeout(()=>span.remove(), 650);
    });
  });
}

/* ---------------- Signal rail (thin section divider) ---------------- */
function initRail(canvas){
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W,H,t=0;
  function resize(){
    const rect = canvas.getBoundingClientRect();
    W = canvas.width = rect.width*devicePixelRatio;
    H = canvas.height = rect.height*devicePixelRatio;
  }
  resize();
  window.addEventListener('resize', resize);
  const dots = 5;
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle = 'rgba(30,136,229,0.25)';
    ctx.lineWidth = devicePixelRatio;
    ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke();
    for(let i=0;i<dots;i++){
      const p = ((t/240)+(i/dots))%1;
      const x = p*W;
      ctx.beginPath();
      ctx.fillStyle = i%2===0 ? '#1E88E5' : '#FF7A45';
      ctx.arc(x,H/2,3.4*devicePixelRatio,0,Math.PI*2);
      ctx.fill();
    }
    t++;
    if(!reduced) requestAnimationFrame(draw);
  }
  draw();
}

document.addEventListener('layout:ready', function(){
  initScrollReveal();
  initCounters();
  initTilt();
  initRipple();
  document.querySelectorAll('.hero canvas, .page-hero canvas, .graph-panel canvas').forEach(c=>initNetworkCanvas(c));
  document.querySelectorAll('.rail canvas').forEach(c=>initRail(c));
});
