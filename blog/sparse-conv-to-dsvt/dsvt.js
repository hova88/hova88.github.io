(() => {
  const progress = document.querySelector('#reading-progress');
  if (!progress) return;

  const update = () => {
    const remaining = document.documentElement.scrollHeight - window.innerHeight;
    const percent = remaining > 0 ? Math.min(100, (window.scrollY / remaining) * 100) : 0;
    progress.style.width = `${percent}%`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();
