// modules/ai_admin.js
window.AIAdmin = {
  async isAdmin(){
    const { data: user } = await SB.auth.getUser();
    const uid = user?.user?.id;
    if(!uid) return false;
    const { data, error } = await SB.from('profiles').select('role').eq('user_id', uid).single();
    return data?.role === 'admin';
  },
  async render(){
    const wrap = document.querySelector('#admin-redemptions');
    if(!(await this.isAdmin())){ wrap.innerHTML = '<div class="text-gray-600">ต้องเป็นแอดมินเท่านั้น</div>'; return; }
    wrap.innerHTML = 'กำลังโหลดคำขอแลก...';
    const { data, error } = await SB.from('redemptions')
      .select('id, status, quantity, created_at, user_id, reward_id, admin_note')
      .order('created_at', { ascending: false });
    if(error){ wrap.innerHTML = `<div class="text-red-600">${error.message}</div>`; return; }
    wrap.innerHTML = (data||[]).map(x=>`
      <div class="card bg-white rounded-xl p-4 flex items-center justify-between">
        <div>
          <div class="text-sm text-gray-600">#${x.id}</div>
          <div>สถานะ: <b>${x.status}</b> · จำนวน: ${x.quantity}</div>
          <div class="text-xs text-gray-500">สร้างเมื่อ: ${new Date(x.created_at).toLocaleString()}</div>
        </div>
        <div class="flex gap-2">
          ${['pending','approved','rejected','delivered'].map(s=>`
            <button class="px-3 py-1 rounded border ${x.status===s?'bg-blue-600 text-white':''}"
              data-id="${x.id}" data-status="${s}">${s}</button>
          `).join('')}
        </div>
      </div>
    `).join('') || '<div class="text-gray-500">ยังไม่มีคำขอแลก</div>';

    wrap.querySelectorAll('button[data-status]').forEach(btn=>{
      btn.onclick = async()=>{
        const id = btn.dataset.id, st = btn.dataset.status;
        const note = prompt('บันทึกโน้ต (ถ้ามี)', '');
        const { error } = await SB.rpc('admin_set_redemption_status', { p_redemption: id, p_status: st, p_note: note });
        if(error) alert(error.message); else { alert('อัปเดตแล้ว'); AIAdmin.render(); }
      };
    });
  }
};
