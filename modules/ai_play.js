// modules/ai_play.js
window.AIPlay = {
  _state: { lessonId: null, questions: [], idx: 0 },
  async render(lessonId){
    if(!lessonId){ location.hash = '#ai-home'; return; }
    this._state.lessonId = lessonId;
    const box = document.querySelector('#play-box');
    box.innerHTML = 'กำลังโหลดคำถาม...';

    const { data: qs, error } = await SB.from('questions')
      .select('id, prompt, choices, type, explanation, points, order_index')
      .eq('lesson_id', lessonId)
      .order('order_index');
    if(error){ box.innerHTML = `<div class="text-red-600">${error.message}</div>`; return; }
    this._state.questions = qs || [];
    this._state.idx = 0;
    if(this._state.questions.length===0){ box.innerHTML='ยังไม่มีคำถาม'; return; }
    this.renderQuestion();
  },
  renderQuestion(){
    const q = this._state.questions[this._state.idx];
    const box = document.querySelector('#play-box');
    if(!q){ box.innerHTML = '<div>เสร็จสิ้นบทเรียน 🎉</div>'; return; }

    if(q.type==='mcq' || q.type==='truefalse'){
      const choices = q.choices || [];
      box.innerHTML = `
        <div class="text-sm text-gray-500 mb-1">ข้อ ${this._state.idx+1}/${this._state.questions.length}</div>
        <div class="text-lg font-semibold">${q.prompt}</div>
        <div class="mt-3 space-y-2">${choices.map((c,i)=>`
          <button class="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded answer-btn" data-key="${i+1}">${i+1}. ${c}</button>
        `).join('')}</div>
        <div id="feedback" class="mt-4"></div>
      `;
      document.querySelectorAll('.answer-btn').forEach(btn=>{
        btn.onclick = ()=> this.submit(q.id, btn.dataset.key);
      });
    } else {
      box.innerHTML = `<div>ยังไม่รองรับประเภทคำถาม: ${q.type}</div>`;
    }
  },
  async submit(qid, key){
    if(!(await needAuth())) return;
    const fb = document.querySelector('#feedback');
    fb.innerHTML = 'กำลังตรวจคำตอบ...';
    const { data, error } = await SB.rpc('submit_answer', { p_question: qid, p_answer: String(key) });
    if(error){ fb.innerHTML = `<div class="text-red-600">${error.message}</div>`; return; }
    fb.innerHTML = data.is_correct
      ? `<div class="px-3 py-2 bg-green-50 text-green-800 rounded">ถูกต้อง! +${data.coins_awarded} เหรียญ<br><span class="text-sm">${data.explanation||''}</span></div>`
      : `<div class="px-3 py-2 bg-red-50 text-red-800 rounded">ยังไม่ถูก ลองใหม่ได้<br><span class="text-sm">${data.explanation||''}</span></div>`;
    await refreshBalance();
    // ถ้าถูกไปข้อถัดไป
    if(data.is_correct){
      this._state.idx++;
      setTimeout(()=> this.renderQuestion(), 800);
    }
  }
};
