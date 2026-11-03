(function(){
'use strict';
const all=(Array.isArray(window.SIXNEWS_ARTICLES)?window.SIXNEWS_ARTICLES:[]).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))||Number(a.id||0)-Number(b.id||0));
const main=document.getElementById('main');
const search=document.getElementById('search');
const searchbox=document.getElementById('searchbox');
const searchButton=document.getElementById('search-button');
const progress=document.getElementById('read-progress');
const nav=document.querySelectorAll('#navigation a[data-category]');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const formatDate=s=>{const d=new Date(String(s)+'T12:00:00');return isNaN(d.getTime())?'':d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})};
const url=a=>'?story='+encodeURIComponent(a.slug);
const sectionURL=category=>category==='All'?'./':'?section='+encodeURIComponent(category);
function setActive(category){
  nav.forEach(n=>{const active=n.dataset.category===category;n.classList.toggle('active',active);if(active)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current')});
}
function card(a){
  return `<a class="news-card" href="${url(a)}">
    <img src="${esc(a.image)}" alt="${esc(a.imageAlt||a.title)}" loading="lazy" decoding="async">
    <span class="eyebrow">${esc(a.category)}</span>
    <h3>${esc(a.title)}</h3>
    <p>${esc(a.deck)}</p>
    <span class="meta">${formatDate(a.date)} <span aria-hidden="true">·</span> ${esc(a.readingMinutes)} min read</span>
  </a>`;
}
function sideFeature(a){
  return `<a class="side-feature" href="${url(a)}">
    <img src="${esc(a.image)}" alt="" loading="lazy" decoding="async">
    <div><span class="eyebrow">${esc(a.category)}</span><h3>${esc(a.title)}</h3><span class="meta">${formatDate(a.date)}</span></div>
  </a>`;
}
function leadFeature(a){
  const label=a.slug.includes('liam-smith')?'LATEST UPDATE':'TOP STORY';
  return `<a class="lead" href="${url(a)}" aria-label="${esc(a.title)}">
    <div class="lead-visual"><img src="${esc(a.image)}" alt="${esc(a.imageAlt||a.title)}" fetchpriority="high"><span class="lead-flag">${label}</span></div>
    <div class="lead-copy"><span class="eyebrow">${esc(a.category)} <span aria-hidden="true">·</span> ${esc(a.location)}</span>
      <h2>${esc(a.title)}</h2><p>${esc(a.deck)}</p>
      <span class="meta">${formatDate(a.date)} <span aria-hidden="true">·</span> ${esc(a.readingMinutes)} min read</span>
    </div>
  </a>`;
}
function aside(current){
  const latest=all.filter(a=>!current||a.slug!==current.slug).slice(0,5);
  return `<aside class="aside ${current?'article-aside':''}" aria-label="More Greenwick news">
  <section class="sidebar-block">
    <h3>Just In <span class="live-dot" aria-hidden="true" style="margin-left:7px"></span></h3>
    ${latest.map(a=>`<a class="side-link" href="${url(a)}">${esc(a.title)}<span class="sub">${esc(a.category)} <span aria-hidden="true">·</span> ${formatDate(a.date)}</span></a>`).join('')}
  </section>
  <section class="sidebar-block"><h3>Across Greenwick</h3>
    <p class="aside-note">Reporting from Elderview, Silvershore, Westmarch, Northwell and Eldermoor — keeping Greenwick informed.</p>
    <img class="flag" src="assets/greenwick-flag.jpg" loading="lazy" alt="Flag of the Commonwealth of Greenwick">
  </section>
  </aside>`;
}
function home(category='All',query=''){
  progress.style.transform='scaleX(0)';
  const term=query.trim().toLocaleLowerCase();
  const matches=all.filter(a=>(category==='All'||category==='Latest'||a.category===category)&&(!term||[a.title,a.deck,a.category,a.location].join(' ').toLocaleLowerCase().includes(term)));
  setActive(term?'':category);
  const isLanding=category==='All'&&!term;
  const showLead=category!=='Latest'&&!term&&matches.length>0;
  const feature=showLead?matches[0]:null;
  const side=showLead?matches.slice(1,3):[];
  const remaining=showLead?matches.slice(1+side.length):matches;
  const heading=term?'Search Results':category==='All'?'Top Stories':category==='Latest'?'Just In':category;
  const desc=term?'Stories matching your search':category==='All'?'The stories shaping Greenwick today':category==='Latest'?'The latest from the 6NEWS newsroom':'Reporting and developments from across Greenwick';
  document.title=(category==='All'&&!term?'Latest News & Headlines':heading)+' | 6NEWS Greenwick';
  main.innerHTML=`
    <header class="home-head"><div><div class="kicker">6NEWS GREENWICK <span aria-hidden="true"> / </span> ${esc(category==='All'?'THE LATEST':category.toUpperCase())}</div>
    <h1>${esc(heading)}</h1><p class="home-sub">${esc(desc)}</p></div>
    <div class="home-date">LATEST EDITION<br>${all.length?formatDate(all[0].date):''}</div></header>
    ${term?`<p class="filter-result">Showing ${matches.length} ${matches.length===1?'story':'stories'} for “${esc(query)}”</p>`:''}
    ${feature?`<section class="lead-area ${side.length?'':'solo'}" aria-label="Featured news">${leadFeature(feature)}
       ${side.length?`<div class="side-stack">${side.map(sideFeature).join('')}<div class="briefing"><strong>The Greenwick briefing</strong><p>Politics, community affairs, sport, weather and more — reported together, all in one place.</p></div></div>`:''}
    </section>`:''}
    <div class="home-layout"><section>
      <div class="section-heading"><h2 class="rule-title">${showLead?'More News':term?'Matching Stories':category==='Latest'?'Latest Headlines':esc(category)+' News'}</h2><span class="section-label">${matches.length} ${matches.length===1?'STORY':'STORIES'}</span></div>
      ${remaining.length?`<div class="grid">${remaining.map(card).join('')}</div>`:'<div class="none">No matching stories yet. Try a different category or search.</div>'}
    </section>${aside(null)}</div>
    ${isLanding?`<section class="topic-strip"><div><span class="eyebrow">FROM THE COMMONWEALTH</span><h2>News that matters, from across Greenwick.</h2></div><a href="?section=Latest" data-go-section="Latest">Explore all headlines <span aria-hidden="true">↗</span></a></section>`:''}
  `;
}
function story(slug){
  const a=all.find(x=>x.slug===slug);
  if(!a){home();return}
  setActive(a.category);
  document.title=a.title+' | 6NEWS Greenwick';
  const body=(a.sections||[]).map(([heading,paragraphs])=>`<section><h2>${esc(heading)}</h2>${(paragraphs||[]).map(p=>`<p>${esc(p)}</p>`).join('')}</section>`).join('');
  const media=(a.media||[]).map(m=>`<figure class="media-shot"><img src="${esc(m.src)}" alt="${esc(m.alt||'Censored image')}" loading="lazy" decoding="async"><figcaption>${esc(m.caption||'Image')}</figcaption></figure>`).join('');
  const related=all.filter(b=>b.slug!==a.slug).sort((x,y)=>Number(y.category===a.category)-Number(x.category===a.category)||String(y.date).localeCompare(String(x.date))).slice(0,3);
  main.innerHTML=`<div class="article-layout">
    <article class="article">
      <div class="crumb"><a href="./">6NEWS Home</a><span aria-hidden="true">/</span><a href="${sectionURL(a.category)}" data-go-section="${esc(a.category)}">${esc(a.category)}</a><span aria-hidden="true">/</span><span>${esc(a.location)}</span></div>
      <span class="eyebrow">${esc(a.category)} <span aria-hidden="true">·</span> ${esc(a.location)}</span>
      <h1>${esc(a.title)}</h1>
      <p class="deck">${esc(a.deck)}</p>
      <div class="authorbar"><strong>${esc(a.author)}</strong><span aria-hidden="true">·</span><time datetime="${esc(a.date)}">${formatDate(a.date)}</time><span aria-hidden="true">·</span><span>${esc(a.readingMinutes)} min read</span></div>
      <figure class="hero"><img src="${esc(a.image)}" alt="${esc(a.imageAlt||a.title)}" fetchpriority="high"><figcaption>${esc(a.caption)}</figcaption></figure>
      ${media?`<section class="media-gallery" aria-label="Article photo gallery"><h2>Images from the story</h2><div class="media-grid">${media}</div></section>`:''}
      <div class="article-body">${body}</div>
      <div class="story-end"><p>6NEWS Greenwick reporting. Additional details will be added to this article when available.</p>
      <div class="article-end-links"><button type="button" class="btn" id="print">Print story</button><button type="button" class="btn" id="share">Copy story link</button><a class="btn" href="./">More 6NEWS stories</a></div></div>
      <h2 class="rule-title">More from 6NEWS</h2>
      <div class="related-grid">${related.map(card).join('')}</div>
    </article>${aside(a)}</div>`;
  const print=main.querySelector('#print');if(print)print.addEventListener('click',()=>window.print());
  const share=main.querySelector('#share');if(share)share.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);share.textContent='Link copied ✓'}catch(e){share.textContent='Copy from address bar'}});
  updateReadProgress();
}
function goCategory(category){
  if(!['All','Latest','Politics','Crime','Business','Sport','Weather','Technology'].includes(category))category='All';
  search.value='';const next=category==='All'?location.pathname:location.pathname+'?section='+encodeURIComponent(category);
  history.pushState({},'',next);home(category);window.scrollTo({top:0,behavior:'instant'});
}
function route(){
  const p=new URLSearchParams(location.search),slug=p.get('story'),term=p.get('q')||'',section=p.get('section')||'All';
  search.value=term;
  if(slug){story(slug)}else home(section,term);
}
function updateReadProgress(){
  if(!new URLSearchParams(location.search).has('story')){progress.style.transform='scaleX(0)';return}
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.transform='scaleX('+Math.min(1,Math.max(0,max>0?window.scrollY/max:0))+')';
}
nav.forEach(n=>n.addEventListener('click',e=>{
  if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  e.preventDefault();goCategory(n.dataset.category);
}));
document.addEventListener('click',e=>{
  const section=e.target.closest('a[data-go-section]');
  if(section&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();goCategory(section.dataset.goSection);return}
  const link=e.target.closest('a[href^="?story="]');
  if(!link||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;
  e.preventDefault();const href=link.getAttribute('href');
  const slug=new URLSearchParams(href.slice(href.indexOf('?'))).get('story');
  history.pushState({},'',location.pathname+'?story='+encodeURIComponent(slug));
  story(slug);window.scrollTo({top:0,behavior:'instant'});
});
search.addEventListener('input',()=>{
  const term=search.value.trim();
  history.replaceState({},'',location.pathname+(term?'?q='+encodeURIComponent(term):''));
  home('All',term);
});
if(searchButton){searchButton.addEventListener('click',()=>{
  const open=searchbox.classList.toggle('open');searchButton.setAttribute('aria-expanded',String(open));if(open)search.focus();else search.blur()
})}
document.addEventListener('keydown',e=>{
  if(e.key==='/'&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&!/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)){e.preventDefault();searchbox.classList.add('open');searchButton.setAttribute('aria-expanded','true');search.focus()}
  if(e.key==='Escape'&&document.activeElement===search){search.blur();searchbox.classList.remove('open');searchButton.setAttribute('aria-expanded','false')}
});
window.addEventListener('scroll',updateReadProgress,{passive:true});
window.addEventListener('popstate',route);
route();
})();
