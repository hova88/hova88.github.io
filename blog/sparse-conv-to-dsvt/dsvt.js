(() => {
  const progress = document.querySelector('#reading-progress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  };
  updateProgress(); addEventListener('scroll', updateProgress, { passive: true }); addEventListener('resize', updateProgress);

  const heroGrid = document.querySelector('#hero-grid');
  const acid = new Set([62,63,79,80,81,97,98,99,100,115,116,117,133,134,150,151,152,168,169,186,187,204,221,238]);
  const cyan = new Set([46,64,82,101,119,137]);
  for (let i = 0; i < 324; i += 1) { const c = document.createElement('i'); if (acid.has(i)) c.className='on'; if (cyan.has(i)) c.className='hot'; heroGrid.append(c); }

  const svg = document.querySelector('#conv-grid');
  const buttons = [...document.querySelectorAll('[data-step]')];
  const count = document.querySelector('#active-count');
  const growth = document.querySelector('#active-growth');
  const cols=22, rows=14, size=27, px=30, py=20, ns='http://www.w3.org/2000/svg';
  const seeds = new Set(['4,5','5,5','6,5','7,5','8,5','8,6','8,7','8,8','9,8','10,8','11,8','12,8','13,8','14,8','15,8','16,8','16,7','16,6','15,5','14,4','13,4','12,5','12,6','11,6','10,6','9,6','9,5']);
  const dilate = input => { const out=new Set(input); input.forEach(key=>{ const [x,y]=key.split(',').map(Number); for(let dx=-1;dx<=1;dx+=1) for(let dy=-1;dy<=1;dy+=1){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<cols&&ny>=0&&ny<rows)out.add(`${nx},${ny}`)}}); return out; };
  const states=[seeds]; for(let i=1;i<=4;i+=1) states.push(dilate(states[i-1]));
  for(let x=0;x<=cols;x+=1){const l=document.createElementNS(ns,'line');l.setAttribute('x1',px+x*size);l.setAttribute('x2',px+x*size);l.setAttribute('y1',py);l.setAttribute('y2',py+rows*size);l.setAttribute('class','grid-line');svg.append(l)}
  for(let y=0;y<=rows;y+=1){const l=document.createElementNS(ns,'line');l.setAttribute('x1',px);l.setAttribute('x2',px+cols*size);l.setAttribute('y1',py+y*size);l.setAttribute('y2',py+y*size);l.setAttribute('class','grid-line');svg.append(l)}
  const render = step => { svg.querySelectorAll('rect').forEach(n=>n.remove()); states[step].forEach(key=>{const [x,y]=key.split(',').map(Number),r=document.createElementNS(ns,'rect');r.setAttribute('x',px+x*size+2);r.setAttribute('y',py+y*size+2);r.setAttribute('width',size-4);r.setAttribute('height',size-4);r.setAttribute('rx',2);r.setAttribute('class',seeds.has(key)?'active-cell seed-cell':'active-cell');svg.append(r)}); count.textContent=states[step].size; const g=Math.round((states[step].size/seeds.size-1)*100);growth.textContent=step===0?'original structure':`${g}% more than input`;buttons.forEach(b=>b.classList.toggle('is-active',Number(b.dataset.step)===step)); };
  buttons.forEach(b=>b.addEventListener('click',()=>render(Number(b.dataset.step)))); render(0);

  const axisButtons=[...document.querySelectorAll('[data-axis]')], axisPanels=[...document.querySelectorAll('[data-axis-panel]')];
  axisButtons.forEach(b=>b.addEventListener('click',()=>{axisButtons.forEach(x=>x.classList.toggle('is-active',x===b));axisPanels.forEach(p=>p.classList.toggle('is-active',p.dataset.axisPanel===b.dataset.axis))}));
  const sections=[...document.querySelectorAll('[data-chapter]')], links=[...document.querySelectorAll('.story-rail a')];
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('is-active',l.getAttribute('href')===`#${e.target.id}`))}),{rootMargin:'-35% 0px -55% 0px'});
  sections.forEach(s=>observer.observe(s));
})();
