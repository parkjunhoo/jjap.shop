class WriteJobManager {
  constructor() {
    this.contacts = [];
    this.postId = this.extractId();
    this.init();
  }

  async init(){
    this.initQuill();
    this.bindEvents();
    await this.loadCategories();
    this.prefillTypeFromQuery();
    this.restoreProfile();
    this.renderContacts();
    if (this.postId) await this.enterEditMode();
  }
  extractId(){ const m = location.search.match(/id=(\d+)/); return m?parseInt(m[1],10):null; }

  async enterEditMode(){
    const { value: pw } = await Swal.fire({title:'비밀번호를 입력해주세요',input:'password',showCancelButton:true,confirmButtonText:'확인',cancelButtonText:'취소'});
    if(!pw){ location.href=`/job-board/${this.postId}`; return; }
    const ok = await fetch('/api/job-board?action=verify_password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:this.postId,password:pw})});
    if(!ok.ok){ await Swal.fire({icon:'error',title:'비밀번호 불일치'}); location.href=`/job-board/${this.postId}`; return; }
    const res = await fetch(`/api/job-board?action=show&id=${this.postId}`);
    const json = await res.json();
    const p = (json.data && json.data.post) || null;
    const contacts = (json.data && json.data.contacts) || [];
    if(!p){ await Swal.fire({icon:'error',title:'게시글이 없습니다.'}); location.href='/job-board'; return; }
    document.getElementById('postType').value = p.post_type;
    document.getElementById('category').value = p.category_id;
    document.getElementById('title').value = p.title || '';
    this.quill.root.innerHTML = p.content || '';
    document.getElementById('content').value = p.content || '';
    const nick = document.getElementById('nickname');
    if (nick) { nick.value = p.nickname || ''; nick.readOnly = true; nick.style.background='#f7fafc'; nick.style.cursor='not-allowed'; }
    const pwEl = document.getElementById('password');
    if (pwEl) { pwEl.disabled = true; pwEl.removeAttribute('required'); pwEl.parentElement.style.display='none'; }
    const rateType = p.rate_type || 'negotiable';
    document.getElementById('rateType').value = rateType;
    document.getElementById('minuteRate').value = p.minute_rate || '';
    document.getElementById('videoRate').value = p.video_rate || '';
    this.togglePayInputs();
    // 연락처 로드
    this.contacts = (contacts||[]).map(c => ({ type: c.type, custom: c.type==='custom' ? (c.label||'') : '', value: c.value }));
    this.renderContacts();
    const form = document.getElementById('writeJobForm');
    const submitBtn = document.querySelector('.form-actions .btn.btn-primary');
    if (submitBtn) submitBtn.textContent = '수정 저장';
    // 폼 제출은 bindEvents에서 분기 처리
  }

  initQuill() {
    this.quill = new Quill('#editor', {
      theme: 'snow',
      modules: { toolbar: [['bold','italic','underline'],[{ 'list':'ordered' },{ 'list':'bullet' }],['link','image'],[{ 'header':[1,2,3,false] }]] }
    });
    this.quill.on('text-change', () => {
      const html = this.quill.root.innerHTML;
      const hidden = document.getElementById('content');
      if (hidden) hidden.value = html;
    });
  }

  bindEvents() {
    const form = document.getElementById('writeJobForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.postId) {
          this.submitUpdate();
        } else {
          this.submit();
        }
      });
    }
    const addBtn = document.getElementById('addContactBtn');
    if (addBtn) addBtn.addEventListener('click', () => this.addContact());

    const categorySel = document.getElementById('category');
    const rateTypeSel = document.getElementById('rateType');
    if (categorySel) {
      categorySel.addEventListener('change', ()=> this.togglePayByCategory());
      this.togglePayByCategory();
    }
    if (rateTypeSel) {
      rateTypeSel.addEventListener('change', ()=> this.togglePayInputs());
      this.togglePayInputs();
    }
  }

  togglePayByCategory() {
    const selectedText = document.getElementById('category').selectedOptions[0]?.textContent || '';
    const row = document.getElementById('payRow');
    if (!row) return;
    // 편집자만 급여 섹션 노출
    row.style.display = selectedText.includes('편집') ? 'flex' : 'none';
  }

  togglePayInputs() {
    const type = document.getElementById('rateType')?.value;
    const gMinute = document.getElementById('minuteRateGroup');
    const gVideo = document.getElementById('videoRateGroup');
    if (!gMinute || !gVideo) return;
    if (type === 'per_minute') { gMinute.style.display = 'flex'; gVideo.style.display = 'none'; }
    else if (type === 'per_video') { gMinute.style.display = 'none'; gVideo.style.display = 'flex'; }
    else { gMinute.style.display = 'none'; gVideo.style.display = 'none'; }
  }

  renderContacts() {
    const wrap = document.getElementById('contactsList');
    if (!wrap) return;
    wrap.innerHTML = '';
    if (this.contacts.length === 0) {
      // 기본 한 줄 제공
      this.contacts.push({ type: 'phone', custom: '', value: '' });
    }
    this.contacts.forEach((c, idx) => {
      const row = document.createElement('div');
      row.className = 'contact-row';
      row.innerHTML = `
        <select class="contact-type" data-idx="${idx}">
          <option value="phone" ${c.type==='phone'?'selected':''}>전화번호</option>
          <option value="email" ${c.type==='email'?'selected':''}>이메일</option>
          <option value="discord" ${c.type==='discord'?'selected':''}>디스코드</option>
          <option value="kakaotalk" ${c.type==='kakaotalk'?'selected':''}>카카오톡ID</option>
          <option value="custom" ${c.type==='custom'?'selected':''}>직접입력</option>
        </select>
        <input class="contact-custom" type="text" placeholder="라벨(예: 텔레그램)" value="${c.custom||''}" data-idx="${idx}" ${c.type==='custom'?'style="display:block"':''}>
        <input class="contact-value" type="text" placeholder="연락처 내용을 입력" value="${c.value||''}" data-idx="${idx}">
        <button type="button" class="remove-contact" data-idx="${idx}">삭제</button>
      `;
      wrap.appendChild(row);
    });
    // 이벤트 바인딩
    wrap.querySelectorAll('.contact-type').forEach(sel => sel.addEventListener('change', (e)=>this.onChangeType(e)));
    wrap.querySelectorAll('.contact-custom').forEach(inp => inp.addEventListener('input', (e)=>this.onChangeCustom(e)));
    wrap.querySelectorAll('.contact-value').forEach(inp => inp.addEventListener('input', (e)=>this.onChangeValue(e)));
    wrap.querySelectorAll('.remove-contact').forEach(btn => btn.addEventListener('click', (e)=>this.removeContact(e)));
  }

  addContact() {
    this.contacts.push({ type: 'phone', custom: '', value: '' });
    this.renderContacts();
  }
  removeContact(e) {
    const idx = parseInt(e.currentTarget.dataset.idx, 10);
    this.contacts.splice(idx, 1);
    this.renderContacts();
  }
  onChangeType(e) {
    const idx = parseInt(e.currentTarget.dataset.idx, 10);
    const val = e.currentTarget.value;
    this.contacts[idx].type = val;
    this.renderContacts();
  }
  onChangeCustom(e) {
    const idx = parseInt(e.currentTarget.dataset.idx, 10);
    this.contacts[idx].custom = e.currentTarget.value;
  }
  onChangeValue(e) {
    const idx = parseInt(e.currentTarget.dataset.idx, 10);
    this.contacts[idx].value = e.currentTarget.value;
  }

  async loadCategories() {
    try {
      const sel = document.getElementById('category');
      if (!sel) return;
      sel.innerHTML = '<option value="">선택</option>';
      // API가 준비되기 전: 하드코딩 대체값
      const cats = [
        { id: 1, name: '편집자', slug: 'editor' },
        { id: 2, name: '멤버', slug: 'member' },
        { id: 3, name: '기타', slug: 'other' }
      ];
      cats.forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = c.name; sel.appendChild(o); });
    } catch {}
  }

  prefillTypeFromQuery() {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    const sel = document.getElementById('postType');
    if (sel && (type === 'recruit' || type === 'job_seek')) sel.value = type;
  }

  restoreProfile() {
    const n = localStorage.getItem('job_nickname');
    const p = localStorage.getItem('job_password');
    if (n) document.getElementById('nickname').value = n;
    if (p) document.getElementById('password').value = p;
  }

  async submit() {
    const payload = {
      post_type: document.getElementById('postType').value,
      category_id: parseInt(document.getElementById('category').value || '0', 10),
      title: document.getElementById('title').value.trim(),
      content: document.getElementById('content').value,
      nickname: document.getElementById('nickname').value.trim(),
      password: document.getElementById('password').value,
      contacts: this.contacts.filter(c => (c.type==='custom'? (c.custom&&c.value) : c.value)).map(c => ({ type:c.type, label: c.type==='custom'?c.custom:undefined, value:c.value })),
      rate_type: document.getElementById('rateType').value, // per_minute | per_video | negotiable
      minute_rate: document.getElementById('minuteRate')?.value,
      video_rate: document.getElementById('videoRate')?.value,
    };
    if (!payload.category_id) return Swal.fire({icon:'warning',title:'입력 필요',text:'카테고리를 선택하세요.'});
    if (!payload.title) return Swal.fire({icon:'warning',title:'입력 필요',text:'제목을 입력하세요.'});
    if (!payload.content || payload.content === '<p><br></p>') return Swal.fire({icon:'warning',title:'입력 필요',text:'내용을 입력하세요.'});
    if (!payload.nickname) return Swal.fire({icon:'warning',title:'입력 필요',text:'닉네임을 입력하세요.'});
    if (!payload.password) return Swal.fire({icon:'warning',title:'입력 필요',text:'비밀번호를 입력하세요.'});
    if (!payload.contacts || payload.contacts.length === 0) return Swal.fire({icon:'warning',title:'입력 필요',text:'연락처를 최소 1개 이상 입력하세요.'});

    // 편집자 외 카테고리일 경우 급여 섹션 제외
    const selectedCatText = document.getElementById('category').selectedOptions[0]?.textContent || '';
    if (!selectedCatText.includes('편집')) {
      payload.rate_type = undefined;
      payload.minute_rate = undefined;
      payload.video_rate = undefined;
    }

    // 프로필 저장
    localStorage.setItem('job_nickname', payload.nickname);
    localStorage.setItem('job_password', payload.password);

    try {
      const res = await fetch('/api/job-board?action=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok || (json.status && json.status>=400)) throw new Error(json.message || '오류');
      await Swal.fire({icon:'success',title:'등록 완료',timer:1200,showConfirmButton:false});
      location.href = `/job-board/${json.data.id}`;
    } catch (e) {
      console.error(e);
      Swal.fire({icon:'error',title:'오류',text:'오류가 발생했습니다. 다시 시도해주세요.'});
    }
  }

  async submitUpdate(){
    const payload = {
      id: this.postId,
      post_type: document.getElementById('postType').value,
      category_id: parseInt(document.getElementById('category').value || '0', 10),
      title: document.getElementById('title').value.trim(),
      content: document.getElementById('content').value,
      contacts: this.contacts.filter(c => (c.type==='custom'? (c.custom&&c.value) : c.value)).map(c => ({ type:c.type, label: c.type==='custom'?c.custom:undefined, value:c.value })),
      rate_type: document.getElementById('rateType').value,
      minute_rate: document.getElementById('minuteRate')?.value,
      video_rate: document.getElementById('videoRate')?.value,
    };
    if (!payload.category_id) return Swal.fire({icon:'warning',title:'입력 필요',text:'카테고리를 선택하세요.'});
    if (!payload.title) return Swal.fire({icon:'warning',title:'입력 필요',text:'제목을 입력하세요.'});
    if (!payload.content || payload.content === '<p><br></p>') return Swal.fire({icon:'warning',title:'입력 필요',text:'내용을 입력하세요.'});
    try{
      const res = await fetch('/api/job-board?action=update',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const json = await res.json().catch(()=>({}));
      if(!res.ok || (json.status&&json.status>=400)) throw new Error(json.message||'수정 실패');
      await Swal.fire({icon:'success',title:'수정되었습니다.',timer:1200,showConfirmButton:false});
      location.href = `/job-board/${this.postId}`;
    }catch(e){ console.error(e); Swal.fire({icon:'error',title:'오류',text:e.message||'수정 중 오류가 발생했습니다.'}); }
  }
}

document.addEventListener('DOMContentLoaded', () => new WriteJobManager());


