// modules/ai_home.js
window.AIHome = {
  async render(){
    const wrap = document.querySelector('#lesson-list');
    wrap.innerHTML = '<div class="text-gray-500">กำลังโหลดบทเรียน...</div>';
    const { data, error } = await SB.from('lessons')
      .select('id, title, summary, cover_url, duration_minutes')
      .eq('is_published', true)
      .order('order_index');

    if(error){ wrap.innerHTML = `<div class="text-red-600">${error.message}</div>`; return; }
    wrap.innerHTML = (data||[]).map(l=>`
      <div class="card bg-white rounded-xl overflow-hidden">
        <img src="${l.cover_url||'https://picsum.photos/seed/ai/800/400'}" class="w-full h-40 object-cover" />
        <div class="p-4">
          <div class="font-semibold">${l.title}</div>
          <div class="text-sm text-gray-600 line-clamp-2">${l.summary||''}</div>
          <div class="text-xs text-gray-500 mt-1">~ ${l.duration_minutes||15} นาที</div>
          <div class="mt-3 flex justify-between">
            <a class="px-3 py-1 bg-blue-600 text-white rounded" href="#ai-lesson?id=${l.id}">ดูรายละเอียด</a>
            <a class="px-3 py-1 bg-green-600 text-white rounded" href="#ai-play?lesson=${l.id}">เริ่มทำแบบฝึก</a>
          </div>
        </div>
      </div>
    `).join('') || '<div class="text-gray-500">ยังไม่มีบทเรียน</div>';
  }
};
