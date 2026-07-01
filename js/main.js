/* ======================================================================
   INet Lab — Main
   ====================================================================== */

window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if(loader){
    setTimeout(() => loader.classList.add('hidden'), 350);
  }
});

// Smooth-scroll for in-page anchors (e.g. footer links to #research-areas)
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href*="#"]');
  if(!a) return;
  const url = new URL(a.href, window.location.href);
  if(url.pathname === window.location.pathname && url.hash){
    const target = document.querySelector(url.hash);
    if(target){
      e.preventDefault();
      target.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  }
});
