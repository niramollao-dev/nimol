// modules/rewards.js
window.Rewards = {
  async render(){
    const wrap = document.querySelector('#rewards-list');
    wrap.innerHTML = 'กำลังโหลด...';
    const { data, error } = await SB.from('rewards')
      .select('id, title, description, image_url, cost_coins, stock, is_active')
      .eq('is_active', true);
    if(error){ wrap.innerHTML = `<div class="text-red-600">${error.message}</div>`; return; }
    wrap.innerHTML = (data||[]).map(r=>`
      <div class="card bg-white rounded-xl p-4 flex gap-4">
        <img src="${r.image_url||'https://picsum.photos/seed/reward/320/240'}" class="w-24 h-24 object-cover rounded"/>
        <div class="flex-1">
          <div class="font-semibold">${r.title}</div>
          <div class="text-sm text-gray-600">${r.description||''}</div>
          <div class="text-sm mt-1">ราคา: <b>${r.cost_coins}</b> เหรียญ · คงเหลือ: ${r.stock}</div>
          <button class="mt-3 px-3 py-1 bg-emerald-600 text-white rounded redeem-btn" data-id="${r.id}" ${r.stock<=0?'disabled class="opacity-50"':''}>แลก</button>
        </div>
      </div>
    `).join('') || '<div class="text-gray-500">ยังไม่มีรางวัล</div>';

    wrap.querySelectorAll('.redeem-btn').forEach(btn=>{
      btn.onclick = async()=>{
        if(!(await needAuth())) return;
        const qty = Number(prompt('จำนวนที่ต้องการแลก', '1') || '1');
        const { data, error } = await SB.rpc('redeem_reward', { p_reward: btn.dataset.id, p_qty: qty });
        if(error) alert(error.message);
        else { alert('ส่งคำขอแลกเรียบร้อย รออนุมัติ'); await refreshBalance(); }
      };
    });
  }
};
