
(()=>{
  const $=(id)=>document.getElementById(id);
  const menu=$('menu-button'),nav=$('main-nav');
  if(menu&&nav){menu.addEventListener('click',()=>{const o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(o));menu.textContent=o?'Chiudi ×':'Menu ☰';});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){if(nav.contains(document.activeElement))menu.focus();nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu ☰';}});}
  if($('trophy-data')){
    const trophies=JSON.parse($('trophy-data').textContent);
    const exhibits=[...document.querySelectorAll('[data-exhibit]')];
    exhibits.forEach(btn=>btn.addEventListener('click',()=>{
      const i=Number(btn.dataset.exhibit),t=trophies[i];
      exhibits.forEach(b=>{const active=b===btn;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
      $('display-category').textContent=`VETRINA 0${i+1} / ${i===4?'PREMIO INDIVIDUALE':'TROFEO DI SQUADRA'}`;
      $('display-art').innerHTML=btn.querySelector('svg').outerHTML;
      $('display-name').textContent=t.name;$('display-count').textContent=t.count;$('display-label').textContent=t.count===1?'titolo':i===4?'premi':'titoli';$('display-desc').textContent=t.desc;
      $('display-years').replaceChildren(...t.years.map(y=>{const s=document.createElement('span');s.textContent=y;return s;}));
    }));
  }
  const viewer=$('viewer'); let previousFocus=null,zoom=1;
  const baseImage=(p)=>p.replace('assets/','assets/');
  function applyZoom(){if(!viewer)return;const img=$('viewer-photo'),stage=$('viewer-image');img.style.width=`${Math.round(100*zoom)}%`;img.style.maxWidth='none';$('viewer-level').textContent=`${Math.round(zoom*100)}%`;}
  const openViewer=(url,caption)=>{if(!viewer)return;previousFocus=document.activeElement;const img=$('viewer-photo');img.src=url;img.alt=caption;$('viewer-title').textContent=caption;zoom=1;applyZoom();viewer.showModal();document.body.style.overflow='hidden';};
  if(viewer){$('viewer-close').addEventListener('click',()=>viewer.close());viewer.addEventListener('close',()=>{document.body.style.overflow='';if(previousFocus&&previousFocus.focus)previousFocus.focus();});$('viewer-in').addEventListener('click',()=>{zoom=Math.min(3,zoom+.25);applyZoom();});$('viewer-out').addEventListener('click',()=>{zoom=Math.max(.5,zoom-.25);applyZoom();});$('viewer-fit').addEventListener('click',()=>{zoom=1;applyZoom();});}
  document.querySelectorAll('[data-modal]').forEach(b=>b.addEventListener('click',()=>{openViewer(b.querySelector('img').src,b.dataset.caption||'Immagine');}));
  if($('kit-panel')){
    const kits=[
    {src:'assets/kit_HOME_viola_oro.webp',name:'Viola. Oro.<br>Killers.',desc:'Il viola luminoso, le sfumature lilla e magenta e i profili oro custodiscono il carattere ribelle dei Killers. Il teschio è integrato tono su tono nella trama.',swatches:['#631c94','#bd7de0','#e7bd38'],board:'assets/home_away_board.webp',label:'Home'},
    {src:'assets/kit_AWAY_giallo_viola.webp',name:'Oro. Viola.<br>Energia.',desc:'L’oro diventa protagonista. Pennellate diagonali viola e dettagli in contrasto rendono l’Away un progetto autonomo, non la Home a colori invertiti.',swatches:['#ebbd31','#4c1766','#edcd63'],board:'assets/home_away_board.webp',label:'Away'},
    {src:'assets/kit_THIRD_dark_cross.webp',name:'Dark Cross.<br>Un altro volto.',desc:'Nero profondo e croce strutturale viola/prugna, con dettagli lilla e soltanto sottili accenti oro. Una terza maglia di geometrie e carattere.',swatches:['#111019','#4a245d','#c3a5d9'],board:'assets/third_board_light.webp',label:'Dark Cross'}];
    let current=0;const buttons=[...document.querySelectorAll('[data-kit]')];
    const show=(i)=>{current=i;let k=kits[i];buttons.forEach((b,j)=>{b.classList.toggle('active',j===i);b.setAttribute('aria-selected',String(j===i));b.tabIndex=j===i?0:-1;});$('kit-number').textContent=`DIVISA 0${i+1} / 2026–27`;$('kit-panel').setAttribute('aria-labelledby',buttons[i].id);$('kit-photo').src=k.src;$('kit-photo').alt='Divisa Killers '+k.label;$('kit-name').innerHTML=k.name;$('kit-description').textContent=k.desc;$('kit-swatches').innerHTML=k.swatches.map(c=>`<i style="background:${c}"></i>`).join('');$('kit-zoom').setAttribute('aria-label','Ingrandisci la divisa '+k.label);};
    buttons.forEach((b,i)=>{
      b.addEventListener('click',()=>show(i));
      b.addEventListener('keydown',e=>{
        let next;
        if(e.key==='ArrowRight')next=(i+1)%buttons.length;
        else if(e.key==='ArrowLeft')next=(i+buttons.length-1)%buttons.length;
        else if(e.key==='Home')next=0;
        else if(e.key==='End')next=buttons.length-1;
        else return;
        e.preventDefault();show(next);buttons[next].focus();
      });
    });
    $('kit-zoom').addEventListener('click',()=>openViewer(kits[current].src,'Divisa Killers '+kits[current].label));$('kit-board').addEventListener('click',()=>openViewer(kits[current].board,'Tavola dettagli '+kits[current].label));
  }
})();
