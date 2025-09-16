// modules/ai_lesson.js
window.AILesson = {
  async render(id){
    if(!id){ location.hash = '#ai-home'; return; }
    const box = document.querySelector('#lesson-detail');
    const resWrap = document.querySelector('#lesson-resources');
    box.innerHTML = 'กำลังโหลด...'; resWrap.innerHTML = '';

    let { data: lesson, error } = await SB.from('lessons').select('*').eq('id', id).single();
    if(error){ box.innerHTML = `<div class="text-red-600">${error.message}</div>`; return; }
    box.innerHTML = `
      <div class="flex gap-4">
        <img src="${lesson.cover_url||'https://picsum.photos/seed/ai/800/400'}" class="w-48 h-32 object-cover rounded" />
        <div>
          <div class="text-xl font-semibold">${lesson.title}</div>
          <div class="text-gray-600">${lesson.summary||''}</div>
          <div class="text-xs text-gray-500 mt-1">ความยาก: ${lesson.difficulty}/5 · ${lesson.duration_minutes||15} นาที</div>
        </div>
      </div>
    `;
    const { data: resources } = await SB.from('lesson_resources')
      .select('kind, url, title, order_index')
      .eq('lesson_id', id).order('order_index');
    resWrap.innerHTML = `
      <h3 class="mt-4 mb-2 font-semibold">สื่อประกอบ</h3>
      <ul class="space-y-2">
        ${(resources||[]).map(r=>`<li>
          <a class="text-blue-600 hover:underline" href="${r.url}" target="_blank">[${r.kind}] ${r.title||r.url}</a>
        </li>`).join('') || '<li class="text-gray-500">ไม่มีสื่อประกอบ</li>'}
      </ul>
    `;
    const startBtn = document.querySelector('#btnStartPlay');
    startBtn.href = `#ai-play?lesson=${id}`;
  }
};
