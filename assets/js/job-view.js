class JobViewPage {
  constructor(){ this.id = this.extractId(); this.init(); }
  extractId(){ 
    // URL이 리다이렉트된 경우를 고려한 ID 추출
    // 1. 기존 /job-board/123 형태
    let m = location.pathname.match(/\/job-board\/(\d+)/);
    if (m) return parseInt(m[1], 10);
    
    // 2. 리다이렉트된 /creator/job-view?id=123 형태
    m = location.pathname.match(/\/creator\/job-view/);
    if (m) {
      const urlParams = new URLSearchParams(location.search);
      const id = urlParams.get('id');
      return id ? parseInt(id, 10) : null;
    }
    
    return null;
  }
  async init(){ if(!this.id) return this.render('잘못된 주소입니다.'); await this.load(); }
  async load(){
    try{
      const res = await fetch(`/api/job-board?action=show&id=${this.id}`);
      if(!res.ok) throw new Error('HTTP '+res.status);
      const json = await res.json();
      const post = (json.data && json.data.post) || null;
      const contacts = (json.data && json.data.contacts) || [];
      if(!post) return this.render('게시글이 없습니다.');
      await this.increaseViewOnce();
      this.renderCard(post, contacts);
    }catch(e){ console.error(e); this.render('불러오는 중 오류가 발생했습니다.'); }
  }
  async increaseViewOnce(){
    try{
      const key = `viewed_job_${this.id}`;
      if (localStorage.getItem(key)) return;
      const res = await fetch('/api/job-board?action=increase_view',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body: JSON.stringify({id:this.id})
      });
      if(res.ok) localStorage.setItem(`viewed_job_${this.id}`,'1');
    }catch(_){ }
  }
  render(msg){ const el=document.getElementById('jobCard'); if(el) el.textContent=msg; }
  renderCard(p, contacts){
    const el=document.getElementById('jobCard'); if(!el) return;
    
    // 페이지 타이틀을 게시글 제목으로 동적 설정
    this.updatePageTitle(p.title, p.category_name);
    
    const rate = this.formatRate(p);
    const enhanced = this.transformYouTube(p.content||'');
    el.innerHTML = `
      <h1>${this.escape(p.title||'')}</h1>
      <div class="job-meta">👤 ${this.escape(p.nickname||'익명')} · 🕒 ${this.formatDate(p.created_at)} · 👁️ ${this.formatNumber(p.view_count??0)}</div>
      <div class="job-content">${enhanced}</div>
      ${rate?`<div class="job-rate badge" style="margin-top:12px">💰 ${rate}</div>`:''}
      ${contacts.length?`<div class="contacts"><h4>📞 연락처</h4>${contacts.map(c=>this.contactRow(c)).join('')}</div>`:''}
      <div class="job-actions" style="margin-top:14px;display:flex;gap:8px;justify-content:flex-end">
        <button id="jobShareBtn" class="btn btn-secondary">📤 공유</button>
        <button id="jobEditBtn" class="btn btn-secondary">✏️ 수정</button>
        <button id="jobDeleteBtn" class="btn btn-primary">🗑️ 삭제</button>
      </div>
    `;
    this.bindActions();
  }
  updatePageTitle(title, categoryName) {
    if (!title) return;
    
    // 페이지 타이틀 업데이트
    const pageTitle = `${title} - ${categoryName || '구인구직'} | 짭샵`;
    document.title = pageTitle;
    
    // 메타 description 업데이트 (동적 생성)
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const newDesc = `${title} - 짭샵 구인구직에서 ${categoryName || '다양한 분야'}의 크리에이터를 찾아보세요.`;
    metaDesc.setAttribute('content', newDesc);
    
    // Open Graph 태그 업데이트
    this.updateOGTags(title, categoryName);
  }
  updateOGTags(title, categoryName) {
    // 기존 OG 태그 제거
    document.querySelectorAll('meta[property^="og:"]').forEach(tag => {
      if (tag.getAttribute('property') === 'og:title' || 
          tag.getAttribute('property') === 'og:description' ||
          tag.getAttribute('property') === 'og:url') {
        tag.remove();
      }
    });
    
    // 새로운 OG 태그 추가
    const ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', `${title} - ${categoryName || '구인구직'} | 짭샵`);
    document.head.appendChild(ogTitle);
    
    const ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    ogDesc.setAttribute('content', `${title} - 짭샵 구인구직에서 ${categoryName || '다양한 분야'}의 크리에이터를 찾아보세요.`);
    document.head.appendChild(ogDesc);
    
    const ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    ogUrl.setAttribute('content', window.location.href);
    document.head.appendChild(ogUrl);
  }
  transformYouTube(html){
    if(!html) return '';
    const container = document.createElement('div');
    container.innerHTML = html;
    const anchors = container.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]');
    anchors.forEach(a=>{
      const href=a.getAttribute('href')||'';
      const embed=this.buildYouTubeIframe(href);
      if(embed){ const w=document.createElement('div'); w.style.margin='12px 0'; w.innerHTML=embed; a.replaceWith(w); }
    });
    container.childNodes.forEach(node=>{
      if(node.nodeType===Node.TEXT_NODE){
        const text=node.textContent||''; const urls=text.match(/https?:\/\/[^\s]+/g);
        if(urls){ let rep=text; urls.forEach(u=>{ if(/youtube\.com|youtu\.be/.test(u)){ const ifr=this.buildYouTubeIframe(u); if(ifr){ rep=rep.replace(u, ifr); } }});
          if(rep!==text){ const span=document.createElement('span'); span.innerHTML=rep; node.replaceWith(span); }
        }
      }
    });
    return container.innerHTML;
  }
  buildYouTubeIframe(url){
    const id=this.extractYouTubeId(url); if(!id) return '';
    const src=`https://www.youtube.com/embed/${id}`;
    return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;"><iframe src="${src}" title="YouTube video" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
  }
  extractYouTubeId(url){
    try{ const u=new URL(url);
      if(u.hostname.includes('youtu.be')) return u.pathname.split('/')[1]||'';
      if(u.hostname.includes('youtube.com')){ if(u.pathname.startsWith('/watch')) return u.searchParams.get('v')||''; if(u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2]||''; }
    }catch(_){ }
    return '';
  }
  bindActions(){
    const edit=document.getElementById('jobEditBtn');
    const del=document.getElementById('jobDeleteBtn');
    const share=document.getElementById('jobShareBtn');
    if(share){ share.addEventListener('click', ()=> this.copyLink()); }
    if(edit){ edit.addEventListener('click', ()=>{
      // 비밀번호 검증은 write 페이지에서 처리
      window.location.href = `/creator/write-job?id=${this.id}`;
    }); }
    if(del){ del.addEventListener('click', async()=>{
      const { value: pw } = await Swal.fire({title:'비밀번호를 입력해주세요',input:'password',inputPlaceholder:'비밀번호',showCancelButton:true,confirmButtonText:'확인',cancelButtonText:'취소'});
      if(!pw) return;
      const res = await fetch('/api/job-board?action=delete',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:this.id,password:pw})});
      const json = await res.json().catch(()=>({}));
      if(!res.ok || (json.status&&json.status>=400)){ Swal.fire({icon:'error',title:json.message||'삭제 실패'}); return; }
      await Swal.fire({icon:'success',title:'삭제되었습니다.',timer:1000,showConfirmButton:false});
      location.href='/creator/job-board';
    }); }
    // 연락처 클릭 복사
    document.querySelectorAll('.contact-item').forEach(el => {
      el.addEventListener('click', async()=>{
        const val = el.querySelector('.contact-value')?.textContent?.trim() || '';
        if(!val) return;
        try{
          await this.copyText(val);
          Swal.fire({icon:'success',title:'복사되었습니다',text: val, timer:1200,showConfirmButton:false});
        }catch(_){ Swal.fire({icon:'error',title:'복사 실패',text:'다시 시도해주세요.'}); }
      });
    });
  }
  async copyText(text){
    if(navigator.clipboard && window.isSecureContext){
      return navigator.clipboard.writeText(text);
    }
    const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.left='-9999px'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
  }
  async copyLink(){
    const url = location.href;
    try{
      if(navigator.clipboard && window.isSecureContext){
        await navigator.clipboard.writeText(url);
      }else{
        const ta = document.createElement('textarea');
        ta.value = url; ta.style.position='fixed'; ta.style.left='-9999px';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
      Swal.fire({icon:'success',title:'링크가 복사되었습니다',timer:1200,showConfirmButton:false});
    }catch(e){
      console.error(e);
      Swal.fire({icon:'error',title:'복사 실패',text:'다시 시도해주세요.'});
    }
  }
  async verifyPassword(password){
    try{
      const res = await fetch('/api/job-board?action=verify_password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:this.id,password})});
      return res.ok;
    }catch(_){ return false; }
  }
  label(c){ if(c.type==='custom') return this.escape(c.label||'연락처'); const map={phone:'전화번호',email:'이메일',discord:'디스코드',kakaotalk:'카카오톡ID'}; return map[c.type]||'연락처'; }
  contactRow(c){
    const icon = this.iconFor(c);
    return `<div class=\"contact-item\" data-type=\"${c.type}\" title=\"클릭하면 복사됩니다\">${icon}<div><span class=\"contact-label\">${this.label(c)}:</span> <span class=\"contact-value\">${this.escape(c.value)}</span></div></div>`;
  }
  iconFor(c){
    if(c.type==='email') return '<span class=\"emoji\">✉️</span>';
    if(c.type==='phone') return '<span class=\"emoji\">📞</span>';
    if(c.type==='discord') return '<img class=\"icon\" src=\"../assets/images/discord.webp\" alt=\"discord\">';
    if(c.type==='kakaotalk') return '<span class=\"emoji\">💬</span>';
    return '<span class=\"emoji\">🔗</span>';
  }
  formatRate(p){ if(p.rate_type==='per_minute') return `분당 ${this.formatNumber(p.minute_rate)}원`; if(p.rate_type==='per_video') return `건당 ${this.formatNumber(p.video_rate)}원`; if(p.rate_type==='negotiable') return '협의 후 결정'; return ''; }
  formatDate(s){ const d=new Date(s); if(isNaN(d)) return ''; const now=new Date(); const same=d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()&&d.getDate()===now.getDate(); if(same){ const hh=String(d.getHours()).padStart(2,'0'); const mm=String(d.getMinutes()).padStart(2,'0'); return `${hh}:${mm}`;} const yy=String(d.getFullYear()).slice(-2); const mm=String(d.getMonth()+1).padStart(2,'0'); const dd=String(d.getDate()).padStart(2,'0'); return `${yy}.${mm}.${dd}`; }
  formatNumber(n){ if(!n) return '0'; n = Number(n); if(n>=1000) return Number(n).toLocaleString(); return String(n); }
  escape(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
}
document.addEventListener('DOMContentLoaded',()=>new JobViewPage());


