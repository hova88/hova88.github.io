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

  const makeSvg = (tag, attrs = {}) => { const node=document.createElementNS(ns,tag); Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,value)); return node; };
  const sparseOpSvg=document.querySelector('#sparse-op-svg');
  if(sparseOpSvg){
    const inputSites=[[1,1],[2,1],[3,1],[3,2],[3,3],[4,3],[5,3],[5,4],[6,4]];
    const siteKey=([x,y])=>`${x},${y}`;
    const sparseButtons=[...document.querySelectorAll('[data-sparse-mode]')];
    const opOutputCount=document.querySelector('#op-output-count'),opPairCount=document.querySelector('#op-pair-count'),opModeNote=document.querySelector('#op-mode-note');
    const notes={subm:'The output set is identical to the input set. Empty neighbors may contribute nothing, but they never become outputs.',regular:'Every lattice site reached by a 3 × 3 kernel becomes an output. This is useful at transitions, but repeated stride-1 layers would dilate the active set.',stride:'A stride-2 layer hashes valid neighborhoods onto a coarser coordinate map. Resolution falls while channels and receptive field usually grow.'};
    const getOutputs=mode=>{
      if(mode==='subm') return inputSites.map(p=>[...p]);
      if(mode==='stride') return [...new Map(inputSites.map(([x,y])=>{const p=[Math.floor(x/2),Math.floor(y/2)];return[siteKey(p),p]})).values()];
      const map=new Map(); inputSites.forEach(([x,y])=>{for(let dx=-1;dx<=1;dx+=1)for(let dy=-1;dy<=1;dy+=1){const p=[x+dx,y+dy];if(p[0]>=0&&p[0]<8&&p[1]>=0&&p[1]<7)map.set(siteKey(p),p)}});return[...map.values()];
    };
    const drawGrid=(ox,oy,cols,rows,step,label)=>{const t=makeSvg('text',{x:ox,y:oy-18,class:'op-label'});t.textContent=label;sparseOpSvg.append(t);for(let x=0;x<=cols;x+=1)sparseOpSvg.append(makeSvg('line',{x1:ox+x*step,y1:oy,x2:ox+x*step,y2:oy+rows*step,class:'op-grid'}));for(let y=0;y<=rows;y+=1)sparseOpSvg.append(makeSvg('line',{x1:ox,y1:oy+y*step,x2:ox+cols*step,y2:oy+y*step,class:'op-grid'}));};
    const drawSparseMode=mode=>{
      sparseOpSvg.replaceChildren();
      const rightStep=mode==='stride'?62:38,rightCols=mode==='stride'?4:8,rightRows=mode==='stride'?4:7;
      drawGrid(28,52,8,7,38,'INPUT COORDINATE MAP · Cᵢₙ');drawGrid(432,52,rightCols,rightRows,rightStep,'OUTPUT COORDINATE MAP · Cₒᵤₜ');
      sparseOpSvg.append(makeSvg('line',{x1:380,y1:28,x2:380,y2:390,class:'op-divider'}));
      const outputs=getOutputs(mode),pairs=[];
      outputs.forEach((out,oi)=>inputSites.forEach((inp,ii)=>{const cx=mode==='stride'?out[0]*2:out[0],cy=mode==='stride'?out[1]*2:out[1];if(Math.abs(inp[0]-cx)<=1&&Math.abs(inp[1]-cy)<=1)pairs.push([ii,oi])}));
      pairs.forEach(([ii,oi])=>{const [ix,iy]=inputSites[ii],[ox,oy]=outputs[oi];sparseOpSvg.append(makeSvg('line',{x1:28+(ix+.5)*38,y1:52+(iy+.5)*38,x2:432+(ox+.5)*rightStep,y2:52+(oy+.5)*rightStep,class:'op-pair'}))});
      inputSites.forEach(([x,y])=>sparseOpSvg.append(makeSvg('circle',{cx:28+(x+.5)*38,cy:52+(y+.5)*38,r:7,class:'op-input'})));
      outputs.forEach(([x,y])=>{const cx=432+(x+.5)*rightStep,cy=52+(y+.5)*rightStep;sparseOpSvg.append(makeSvg('circle',{cx,cy,r:12,class:'op-output-halo'}));sparseOpSvg.append(makeSvg('rect',{x:cx-5,y:cy-5,width:10,height:10,transform:`rotate(45 ${cx} ${cy})`,class:'op-output'}))});
      opOutputCount.textContent=outputs.length;opPairCount.textContent=pairs.length;opModeNote.textContent=notes[mode];sparseButtons.forEach(b=>b.classList.toggle('is-active',b.dataset.sparseMode===mode));
    };
    sparseButtons.forEach(b=>b.addEventListener('click',()=>drawSparseMode(b.dataset.sparseMode)));drawSparseMode('subm');
  }

  const attentionSvg=document.querySelector('#attention-svg');
  if(attentionSvg){
    const points=[[78,78],[156,96],[250,66],[338,128],[455,74],[548,112],[662,70],[98,210],[204,184],[302,236],[420,198],[518,250],[642,210],[130,342],[248,322],[366,356],[498,330],[624,354]];
    const query=9,k=5,tau=6,attentionButtons=[...document.querySelectorAll('[data-attention-mode]')];
    const nameNode=document.querySelector('#attention-mode-name'),scoreNode=document.querySelector('#attention-score-count'),complexityNode=document.querySelector('#attention-complexity'),shapeNode=document.querySelector('#attention-shape'),hiddenNode=document.querySelector('#attention-hidden'),noteNode=document.querySelector('#attention-mode-note');
    const squared=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2;
    const windowId=([x,y])=>(x>=380?1:0)+(y>=220?2:0);
    const setGroups=()=>{const ids=points.map((_,i)=>i).sort((a,b)=>points[a][0]-points[b][0]||points[a][1]-points[b][1]);return Array.from({length:Math.ceil(ids.length/tau)},(_,i)=>ids.slice(i*tau,(i+1)*tau));};
    const groupsFor=mode=>{
      if(mode==='global')return[points.map((_,i)=>i)];
      if(mode==='window')return[0,1,2,3].map(w=>points.map((_,i)=>i).filter(i=>windowId(points[i])===w)).filter(g=>g.length);
      if(mode==='sets')return setGroups();
      return points.map((p,i)=>points.map((_,j)=>j).sort((a,b)=>squared(p,points[a])-squared(p,points[b])).slice(0,k).map(j=>[i,j]));
    };
    const copy={global:{name:'Global attention',bound:'N²',shape:'N × N',hidden:'quadratic memory',note:'Every occupied voxel communicates directly. Token sparsity removes empty cells, but the score matrix still grows quadratically with occupied count.'},window:{name:'Window attention',bound:'Σ nᵥ²',shape:'ragged',hidden:'padding / grouping',note:'Locality bounds the score matrix, but window occupancy follows the scene. Equal physical windows do not produce equal tensor shapes.'},knn:{name:'k-NN attention',bound:'N · k',shape:'N × k',hidden:'neighbor search',note:'The degree is regular after the graph exists. Finding the nearest neighbors and gathering them is data-dependent and often harder to export than QKV attention.'},sets:{name:'Fixed-set attention',bound:'S · τ²',shape:'S × τ × d',hidden:'sort / duplicate / mask',note:'Sorting makes standard batched attention possible. Regular compute is purchased with partition rules, duplicated indices, masks, and indirect communication.'}};
    const drawAttention=mode=>{
      attentionSvg.replaceChildren();
      const label=makeSvg('text',{x:24,y:28,class:'viz-label'});label.textContent='OCCUPIED VOXELS · SELECT A NEIGHBORHOOD POLICY';attentionSvg.append(label);
      if(mode==='window'){
        [[28,42,352,178],[380,42,352,178],[28,220,352,190],[380,220,352,190]].forEach(([x,y,w,h])=>attentionSvg.append(makeSvg('rect',{x,y,width:w,height:h,class:'window-box'})));
      }
      const structure=groupsFor(mode),edges=[],neighbors=new Set([query]);let scoreCount=0;
      if(mode==='knn'){
        structure.forEach(list=>list.forEach(([a,b])=>{if(a!==b)edges.push([a,b]);if(a===query)neighbors.add(b)}));scoreCount=points.length*k;
      }else{
        structure.forEach(group=>{scoreCount+=group.length**2;for(let a=0;a<group.length;a+=1)for(let b=a+1;b<group.length;b+=1)edges.push([group[a],group[b]]);if(group.includes(query))group.forEach(i=>neighbors.add(i));if(mode==='sets'){const xs=group.map(i=>points[i][0]),ys=group.map(i=>points[i][1]);attentionSvg.append(makeSvg('rect',{x:Math.min(...xs)-20,y:Math.min(...ys)-20,width:Math.max(...xs)-Math.min(...xs)+40,height:Math.max(...ys)-Math.min(...ys)+40,rx:18,class:'set-hull'}))}});
      }
      edges.forEach(([a,b])=>{const touches=a===query||b===query;attentionSvg.append(makeSvg('line',{x1:points[a][0],y1:points[a][1],x2:points[b][0],y2:points[b][1],class:`attention-link${touches?' is-query':''}`}))});
      points.forEach(([x,y],i)=>attentionSvg.append(makeSvg('circle',{cx:x,cy:y,r:i===query?9:6,class:`token${i===query?' is-query':neighbors.has(i)?' is-neighbor':''}`})));
      const c=copy[mode];nameNode.textContent=c.name;scoreNode.textContent=scoreCount.toLocaleString();complexityNode.textContent=c.bound;shapeNode.textContent=c.shape;hiddenNode.textContent=c.hidden;noteNode.textContent=c.note;attentionButtons.forEach(b=>b.classList.toggle('is-active',b.dataset.attentionMode===mode));
    };
    attentionButtons.forEach(b=>b.addEventListener('click',()=>drawAttention(b.dataset.attentionMode)));drawAttention('window');
  }

  const axisButtons=[...document.querySelectorAll('[data-axis]')], axisPanels=[...document.querySelectorAll('[data-axis-panel]')];
  axisButtons.forEach(b=>b.addEventListener('click',()=>{axisButtons.forEach(x=>x.classList.toggle('is-active',x===b));axisPanels.forEach(p=>p.classList.toggle('is-active',p.dataset.axisPanel===b.dataset.axis))}));
  const sections=[...document.querySelectorAll('[data-chapter]')], links=[...document.querySelectorAll('.story-rail a')];
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('is-active',l.getAttribute('href')===`#${e.target.id}`))}),{rootMargin:'-35% 0px -55% 0px'});
  sections.forEach(s=>observer.observe(s));
})();
