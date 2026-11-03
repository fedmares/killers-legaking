
(()=>{
 const $=(s)=>document.querySelector(s), $$=(s)=>Array.from(document.querySelectorAll(s));
 const safe=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const download=(name,obj)=>{const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);};
 const getStored=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}};
 const setStored=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
 const readJson=(file)=>new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>{try{resolve(JSON.parse(fr.result))}catch(e){reject(e)}};fr.onerror=reject;fr.readAsText(file)});
 const names={P:'PORTIERI',D:'DIFENSORI',C:'CENTROCAMPISTI',A:'ATTACCANTI',V:'VIVAIO'};
 if($('#roster-data')){
  const base=JSON.parse($('#roster-data').textContent);const key='killers-v5-roster-2026-27';
  let players=(getStored(key)||base).map(p=>({...p}));let role='T',query='';
  const value=(v)=>v===null||v===undefined||v===''?'—':String(v).replace('.',',');
  function render(){
   const visible=players.filter(p=>(role==='T'||p.ruolo===role)&&p.nome.toLocaleLowerCase('it').includes(query));
   $('#players-list').innerHTML=visible.map(p=>`<article class="player-card"><span class="player-position">${safe(names[p.ruolo]||p.ruolo)}</span><div class="player-initial">${safe(p.nome.split(' ').map(n=>n[0]).slice(0,2).join(''))}</div><h3>${safe(p.nome)}</h3><div class="player-numbers"><span>PG <b>${value(p.presenze)}</b></span><span>FM <b>${value(p.fm)}</b></span><span>G+A <b>${p.gol==null||p.assist==null?'—':p.gol+p.assist}</b></span></div></article>`).join('')||'<p class="no-records">Nessun calciatore corrisponde ai filtri.</p>';
   $('#stats-body').innerHTML=players.filter(p=>p.ruolo!=='V').map(p=>`<tr><td>${safe(p.nome)}</td><td>${p.ruolo}</td><td>${value(p.presenze)}</td><td>${value(p.mv)}</td><td>${value(p.fm)}</td><td>${value(p.gol)}</td><td>${value(p.assist)}</td></tr>`).join('');
  }
  $$('[data-role]').forEach(b=>b.addEventListener('click',()=>{role=b.dataset.role;$$('[data-role]').forEach(x=>x.classList.toggle('active',b===x));render()}));
  $('#player-search').addEventListener('input',e=>{query=e.target.value.toLocaleLowerCase('it');render()});
  $('#squad-export').addEventListener('click',()=>download('Killers_statistiche_2026-27.json',{stagione:'2026/27',giocatori:players}));
  $('#squad-clear').addEventListener('click',()=>{if(confirm('Ripristinare i dati di partenza?')){players=base;setStored(key,players);render();$('#squad-feedback').textContent='Rosa di partenza ripristinata.'}});
  $('#squad-import').addEventListener('change',async e=>{if(!e.target.files[0])return;try{const j=await readJson(e.target.files[0]);if(!Array.isArray(j.giocatori))throw new Error('Formato non valido: manca il campo giocatori');let updated=0;const byId=new Map(j.giocatori.filter(p=>p.id!=null).map(p=>[Number(p.id),p]));for(const p of players){const v=byId.get(Number(p.id));if(!v)continue;for(const k of ['presenze','mv','fm','gol','assist','ammonizioni','espulsioni'])if(Object.hasOwn(v,k)){const x=v[k];if(x!==null&&x!==''&&(!Number.isFinite(Number(x))||Number(x)<0))throw new Error('Numero non valido per '+p.nome);p[k]=x===null||x===''?null:Number(x)}updated++}if(!updated)throw new Error('Nessun ID corrispondente');setStored(key,players);render();$('#squad-feedback').textContent=`Statistiche importate per ${updated} calciatori. Esporta per conservarle.`;}catch(err){$('#squad-feedback').textContent='Importazione non riuscita: '+err.message}finally{e.target.value=''}});
  render();
 }
 if($('#schedule-data')){
  const schedule=JSON.parse($('#schedule-data').textContent);const key='killers-v5-results-2026-27';let records=getStored(key)||[];let competition='Tutte';
  function renderSchedule(){const list=schedule.filter(x=>competition==='Tutte'||x.competizione===competition);$('#fixture-board').innerHTML=competition==='Europa UILF'?'<div class="fixture-empty"><strong>Coppa dei Re / Europa UILF</strong><p>Il calendario europeo non è incluso nel file Lega King. Inserisci i risultati verificati nel registro sottostante.</p></div>':list.map(e=>`<article class="fixture-card"><span class="fixture-date">${safe(e.periodo)} <small>${e.anno}</small></span><div><span class="kicker">${safe(e.competizione)}</span><h3>${safe(e.turno)}</h3><p>${e.serieA?'Serie A · giornata '+e.serieA:'Turno programmato'}</p></div><span class="fixture-status">In attesa di referto</span></article>`).join('');}
  function renderResults(){ $('#results-records').innerHTML=records.length?records.map((r,i)=>`<article class="result-record"><div><span class="kicker">${safe(r.competizione)} · ${safe(r.turno)}</span><h3>Killers <b>${r.golKillers} – ${r.golAvversario}</b> ${safe(r.avversario)}</h3>${r.fantapunti!=null?`<p>Fantapunti Killers: ${safe(r.fantapunti)}</p>`:''}</div><button type="button" data-result-delete="${i}" aria-label="Elimina questo risultato">Rimuovi</button></article>`).join(''):'<p class="no-records">Nessun referto registrato. Non sono stati inventati risultati.</p>';
  $$('[data-result-delete]').forEach(b=>b.addEventListener('click',()=>{records.splice(Number(b.dataset.resultDelete),1);setStored(key,records);renderResults()})); }
  $$('[data-competition]').forEach(b=>b.addEventListener('click',()=>{competition=b.dataset.competition;$$('[data-competition]').forEach(x=>x.classList.toggle('active',b===x));renderSchedule()}));
  $('#result-form').addEventListener('submit',e=>{e.preventDefault();const v=new FormData(e.currentTarget);const r={competizione:v.get('competizione'),turno:String(v.get('turno')).trim(),avversario:String(v.get('avversario')).trim(),golKillers:Number(v.get('golKillers')),golAvversario:Number(v.get('golAvversario')),fantapunti:v.get('fantapunti')?Number(v.get('fantapunti')):null};if(!r.turno||!r.avversario)return;records.push(r);setStored(key,records);e.currentTarget.reset();renderResults();$('#results-feedback').textContent='Risultato salvato sul dispositivo. Esporta il JSON per conservarlo.'});
  $('#results-export').addEventListener('click',()=>download('Killers_risultati_2026-27.json',{stagione:'2026/27',risultati:records}));
  $('#results-clear').addEventListener('click',()=>{if(confirm('Cancellare soltanto i referti memorizzati su questo dispositivo?')){records=[];setStored(key,records);renderResults()}});
  $('#results-import').addEventListener('change',async e=>{if(!e.target.files[0])return;try{const j=await readJson(e.target.files[0]);if(!Array.isArray(j.risultati))throw new Error('Campo risultati mancante');for(const r of j.risultati){if(!r.competizione||!r.avversario||!r.turno||!Number.isFinite(Number(r.golKillers))||!Number.isFinite(Number(r.golAvversario)))throw new Error('Referto non valido')}records=j.risultati.map(r=>({...r,golKillers:Number(r.golKillers),golAvversario:Number(r.golAvversario)}));setStored(key,records);renderResults();$('#results-feedback').textContent=`Importati ${records.length} risultati.`}catch(err){$('#results-feedback').textContent='Importazione non riuscita: '+err.message}finally{e.target.value=''}});
  renderSchedule();renderResults();
 }
})();
