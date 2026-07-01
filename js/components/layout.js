/* ======================================================================
   INet Lab — Layout component
   Injects shared header + footer, wires up nav interactions.
   Every page includes: <div id="app-header"></div> ... <div id="app-footer"></div>
   and sets <body data-page="home|about|members|projects|publications|news|contact">
   ====================================================================== */

(function(){
  const NAV_LINKS = [
    { href:'index.html', label:'Home', key:'home' },
    { href:'about.html', label:'About', key:'about' },
    { href:'members.html', label:'Members', key:'members' },
    { href:'projects.html', label:'Projects', key:'projects' },
    { href:'publications.html', label:'Publications', key:'publications' },
    { href:'news.html', label:'News', key:'news' },
    { href:'contact.html', label:'Contact', key:'contact' },
  ];

  function buildHeader(activeKey){
    const links = NAV_LINKS.map(l =>
      `<a href="${l.href}" class="${l.key===activeKey?'active':''}">${l.label}</a>`
    ).join('');

    return `
    <header id="site-header">
      <div class="nav-inner">
        <a href="index.html" class="brand" aria-label="INet Lab home">
          <img src="assets/images/inet-icon.png" alt="INet Lab logo" width="38" height="38">
          <span class="brand-word">
            <b>INet Lab</b>
            <span>INTELLIGENT COMPUTER NETWORKS</span>
          </span>
        </a>
        <nav class="nav-links" aria-label="Primary">${links}</nav>
        <div class="nav-actions">
          <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle light / dark">
            <svg id="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1M12 20v1M4.2 4.2l.8.8M19 19l.8.8M3 12h1M20 12h1M4.2 19.8l.8-.8M19 5l.8-.8"/><circle cx="12" cy="12" r="4.2"/></svg>
          </button>
          <button class="nav-burger" id="nav-burger" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <div class="mobile-panel" id="mobile-panel">${links}</div>
    </header>`;
  }

  function buildFooter(){
    return `
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <img src="assets/images/inet-logo-full.png" alt="Intelligent Computer Networks Research Group">
            <p>Advancing intelligent, reliable communication for IoT and IoV environments — from edge-deployable machine learning to network digital twins.</p>
            <div class="footer-social">
              <a href="mailto:bassem.mokhtar@uaeu.ac.ae" aria-label="Email">✉</a>
              <a href="https://alexu.edu.eg" target="_blank" rel="noopener" aria-label="Alexandria University">🌐</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Explore</h4>
            <a href="about.html">About the Lab</a>
            <a href="members.html">Team</a>
            <a href="projects.html">Projects</a>
            <a href="publications.html">Publications</a>
          </div>
          <div class="footer-col">
            <h4>Research Areas</h4>
            <a href="about.html#research-areas">IoT &amp; IoV Systems</a>
            <a href="about.html#research-areas">ML for Networks</a>
            <a href="about.html#research-areas">TinyML / TinyLLM</a>
            <a href="about.html#research-areas">Network Digital Twins</a>
          </div>
          <div class="footer-col">
            <h4>Connect</h4>
            <a href="contact.html">Contact us</a>
            <a href="news.html">Lab news</a>
            <a href="mailto:bassem.mokhtar@uaeu.ac.ae">bassem.mokhtar@uaeu.ac.ae</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© <span id="year"></span> Intelligent Computer Networks Research Group (INet Lab). All rights reserved.</span>
          <span>Built for a lab that models networks for a living.</span>
        </div>
      </div>
    </footer>
    <button id="back-to-top" aria-label="Back to top">↑</button>
    <div id="scroll-progress"></div>
    `;
  }

  function initHeaderBehavior(){
    const header = document.getElementById('site-header');
    const burger = document.getElementById('nav-burger');
    const panel = document.getElementById('mobile-panel');
    const themeBtn = document.getElementById('theme-toggle');

    function onScroll(){
      if(window.scrollY > 40){ header.classList.add('solid'); }
      else{ header.classList.remove('solid'); }

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop/docHeight)*100 : 0;
      const bar = document.getElementById('scroll-progress');
      if(bar) bar.style.width = pct + '%';

      const backBtn = document.getElementById('back-to-top');
      if(backBtn){ backBtn.classList.toggle('show', scrollTop > 500); }
    }
    document.addEventListener('scroll', onScroll, { passive:true });
    onScroll();

    burger.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      panel.classList.remove('open');
      burger.classList.remove('open');
    }));

    // Theme
    const stored = localStorage.getItem('inetlab-theme');
    if(stored === 'dark'){ document.documentElement.setAttribute('data-theme','dark'); }
    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if(isDark){ document.documentElement.removeAttribute('data-theme'); localStorage.setItem('inetlab-theme','light'); }
      else{ document.documentElement.setAttribute('data-theme','dark'); localStorage.setItem('inetlab-theme','dark'); }
    });

    const backBtn = document.getElementById('back-to-top');
    backBtn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function mount(){
    const headerSlot = document.getElementById('app-header');
    const footerSlot = document.getElementById('app-footer');
    const activeKey = document.body.getAttribute('data-page') || 'home';
    if(headerSlot) headerSlot.outerHTML = buildHeader(activeKey);
    if(footerSlot) footerSlot.outerHTML = buildFooter();
    initHeaderBehavior();
    document.dispatchEvent(new CustomEvent('layout:ready'));
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
