// app.js — core, router, auth, helpers
window.SB = supabase.createClient(APP.SUPABASE_URL, APP.SUPABASE_ANON_KEY);

const qs = (s)=>document.querySelector(s);
const qsa = (s)=>Array.from(document.querySelectorAll(s));
const show = (id)=>{ qsa('main section').forEach(el=>el.classList.add('hide')); qs(id).classList.remove('hide'); };
const fmt = (n)=>new Intl.NumberFormat('th-TH').format(n||0);

async function refreshBalance(){
  const { data, error } = await SB.rpc('get_my_coin_balance');
  qs('#coin-balance').textContent = fmt(data||0);
}

async function needAuth(){
  const { data: { user } } = await SB.auth.getUser();
  if(!user){
    alert('กรุณาเข้าสู่ระบบก่อนใช้งาน');
    return false;
  }
  return true;
}

async function route(){
  const hash = location.hash || '#ai-home';
  if(hash.startsWith('#ai-home')){
    show('#view-home'); await AIHome.render();
  } else if(hash.startsWith('#ai-lesson')){
    show('#view-lesson'); await AILesson.render(new URLSearchParams(location.hash.split('?')[1]).get('id'));
  } else if(hash.startsWith('#ai-play')){
    show('#view-play'); await AIPlay.render(new URLSearchParams(location.hash.split('?')[1]).get('lesson'));
  } else if(hash.startsWith('#rewards')){
    show('#view-rewards'); await Rewards.render();
  } else if(hash.startsWith('#ai-admin')){
    show('#view-admin'); await AIAdmin.render();
  } else {
    location.hash = '#ai-home';
  }
  refreshBalance();
}

window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', async()=>{
  // Auth UI (Magic Link แบบง่าย)
  qs('#btnLogin').onclick = async()=>{
    const email = prompt('อีเมลสำหรับรับลิงก์เข้าสู่ระบบ');
    if(!email) return;
    const { error } = await SB.auth.signInWithOtp({ email });
    if(error) alert(error.message);
    else alert('ส่งลิงก์เข้าสู่ระบบไปที่อีเมลแล้ว');
  };
  qs('#btnLogout').onclick = async()=>{ await SB.auth.signOut(); location.reload(); };

  SB.auth.onAuthStateChange(async(event, session)=>{
    const user = session?.user;
    qs('#btnLogin').classList.toggle('hide', !!user);
    qs('#btnLogout').classList.toggle('hide', !user);
    qs('#user-email').textContent = user?.email || '';
    await route();
  });

  await route();
});
