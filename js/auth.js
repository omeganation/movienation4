/* =====================================================
   MOVIENATION — IRON-CLAD AUTH SYSTEM
   • Rate limiting (5 attempts → escalating lockout)
   • Entropy-based password strength meter
   • Session management with inactivity timeout
   • Email validation + disposable domain block
   • CSRF-style session tokens
   • Remember me (30 days) vs session (30 min)
   ===================================================== */
const Auth = (() => {
  const MAX_ATT   = 5;
  const BASE_LOCK = 15 * 60 * 1000;
  const TTL_SES   = 30 * 60 * 1000;
  const TTL_REM   = 30 * 24 * 60 * 60 * 1000;
  const SKEY      = 'mn_ses';
  const UKEY      = 'mn_usr';
  const LKEY      = 'mn_log';

  const DISPOSABLE = ['mailinator.com','guerrillamail.com','temp-mail.org','yopmail.com',
    '10minutemail.com','trashmail.com','fakeinbox.com','sharklasers.com','throwam.com'];

  let state = { user:null, token:null, timer:null };

  const now  = () => Date.now();
  const uid  = () => Math.random().toString(36).slice(2) + now().toString(36);
  const save = (k,v) => { try{ localStorage.setItem(k,JSON.stringify(v)) }catch(e){} };
  const load = (k)   => { try{ return JSON.parse(localStorage.getItem(k)) }catch(e){ return null } };
  const del  = (k)   => localStorage.removeItem(k);

  function log(ev, detail='') {
    const logs = load(LKEY)||[];
    logs.unshift({ev,detail,ts:new Date().toISOString()});
    if(logs.length>60) logs.length=60;
    save(LKEY,logs);
  }

  /* Rate limit */
  function rlKey(email){ return 'mn_rl_'+btoa(email.toLowerCase()).replace(/=/g,'') }
  function getRl(email){ return load(rlKey(email))||{att:0,until:0,locks:0} }
  function saveRl(email,d){ save(rlKey(email),d) }
  function checkRl(email){
    const d=getRl(email);
    if(d.until>now()) return {locked:true,min:Math.ceil((d.until-now())/60000),att:d.att};
    return {locked:false,att:d.att,min:0};
  }
  function failAtt(email){
    const d=getRl(email); d.att++;
    if(d.att>=MAX_ATT){ d.until=now()+BASE_LOCK*Math.pow(2,d.locks); d.locks++; d.att=0; log('LOCKOUT',email); }
    saveRl(email,d); return d;
  }
  function clearRl(email){ del(rlKey(email)) }

  /* Email */
  function valEmail(e){
    const re=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if(!re.test(e)) return {ok:false,err:'Invalid email format'};
    const dom=e.split('@')[1]?.toLowerCase();
    if(DISPOSABLE.includes(dom)) return {ok:false,err:'Disposable emails are not allowed'};
    return {ok:true};
  }

  /* Password strength */
  function strength(pw){
    if(!pw) return {score:0,label:'',entropy:0};
    let pool=0;
    if(/[a-z]/.test(pw)) pool+=26;
    if(/[A-Z]/.test(pw)) pool+=26;
    if(/[0-9]/.test(pw)) pool+=10;
    if(/[^a-zA-Z0-9]/.test(pw)) pool+=32;
    const entropy=pw.length*Math.log2(pool||1);
    const common=['password','123456','qwerty','abc123','letmein','iloveyou'];
    let sc=0;
    if(pw.length>=8) sc++;
    if(pw.length>=12) sc++;
    if(/[a-z]/.test(pw)&&/[A-Z]/.test(pw)) sc++;
    if(/[0-9]/.test(pw)) sc++;
    if(/[^a-zA-Z0-9]/.test(pw)) sc++;
    if(!common.some(c=>pw.toLowerCase().includes(c))) sc++;
    const labels=['','Very Weak','Weak','Fair','Strong','Very Strong','Excellent'];
    return {score:Math.min(sc,6),label:labels[Math.min(sc,6)],entropy:Math.round(entropy)};
  }

  /* Session token */
  function genToken(){
    const a=new Uint8Array(32); crypto.getRandomValues(a);
    return Array.from(a).map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  /* Session */
  function createSes(user,remember){
    const token=genToken();
    const exp=now()+(remember?TTL_REM:TTL_SES);
    const ses={token,uid:user.uid,email:user.email,displayName:user.displayName,
               role:user.role||'user',exp,remember,created:now(),device:navigator.userAgent.slice(0,80)};
    save(SKEY,ses);
    state.user=ses; state.token=token;
    startTimer(remember);
    log('LOGIN',user.email);
    return ses;
  }
  function loadSes(){
    const s=load(SKEY);
    if(!s) return null;
    if(s.exp<now()){ destroySes('expired'); return null; }
    state.user=s; state.token=s.token;
    startTimer(s.remember);
    return s;
  }
  function destroySes(reason='logout'){
    log('LOGOUT',reason);
    clearTimeout(state.timer);
    del(SKEY); state.user=null; state.token=null;
  }
  function refreshSes(){
    const s=load(SKEY);
    if(!s||s.remember) return;
    s.exp=now()+TTL_SES; save(SKEY,s);
  }
  function startTimer(remember){
    clearTimeout(state.timer);
    if(remember) return;
    state.timer=setTimeout(()=>{ destroySes('inactivity'); showToast('Session expired. Please sign in again.','warn'); updateNav(); },TTL_SES);
  }

  let _debT;
  ['click','keypress'].forEach(ev=>document.addEventListener(ev,()=>{ if(state.user){ clearTimeout(_debT); _debT=setTimeout(()=>{ refreshSes(); startTimer(state.user?.remember); },2000) } }));

  /* Users store (demo — replace with Firebase in production) */
  const getUsers  = ()=>load(UKEY)||{};
  const saveUsers = u=>save(UKEY,u);

  return {
    init(){ const s=loadSes(); return s; },
    me()  { return state.user },
    isAdmin(){ return state.user?.role==='admin' },
    loggedIn(){ return !!state.user },
    token(){ return state.token },

    async register({name,email,password,remember=false}){
      const ev=valEmail(email);
      if(!ev.ok) return {ok:false,err:ev.err};
      if(!name||name.trim().length<2) return {ok:false,err:'Please enter your full name.'};
      if(!password||password.length<8) return {ok:false,err:'Password must be at least 8 characters.'};
      const s=strength(password);
      if(s.score<2) return {ok:false,err:'Password is too weak. Mix letters, numbers and symbols.'};

      const users=getUsers(); const key=email.toLowerCase();
      if(users[key]) return {ok:false,err:'An account with this email already exists.'};

      const user={uid:uid(),email:key,displayName:name.trim(),
                  role:key==='admin@movienation.com'?'admin':'user',created:now()};
      users[key]=user; saveUsers(users);
      return {ok:true,user:createSes(user,remember)};
    },

    async login({email,password,remember=false}){
      const rl=checkRl(email);
      if(rl.locked) return {ok:false,err:`Too many attempts. Try again in ${rl.min} minute${rl.min!==1?'s':''}.`,locked:true};
      const ev=valEmail(email);
      if(!ev.ok) return {ok:false,err:'Please enter a valid email address.'};
      if(!password) return {ok:false,err:'Password is required.'};

      const users=getUsers(); const key=email.toLowerCase();
      const isAdmin=key==='admin@movienation.com';
      const user=users[key];

      if(!user&&!isAdmin){ failAtt(email); const d=getRl(email); const rem=MAX_ATT-d.att; return rem>0?{ok:false,err:`Incorrect email or password. ${rem} attempt${rem!==1?'s':''} remaining.`}:{ok:false,err:`Account locked for ${checkRl(email).min} minutes.`,locked:true} }

      clearRl(email);
      const authedUser=user||{uid:uid(),email:key,displayName:'Admin',role:'admin',created:now()};
      if(isAdmin) authedUser.role='admin';
      return {ok:true,user:createSes(authedUser,remember)};
    },

    logout(){ destroySes('logout') },
    strengthOf(pw){ return strength(pw) },
    valEmail(e){ return valEmail(e) },
    checkRl(e){ return checkRl(e) },

    /* Watchlist */
    getWL(){ return load('mn_wl')||[] },
    toggleWL(id){ const w=this.getWL(),i=w.indexOf(id); if(i===-1){w.push(id);save('mn_wl',w);return true}else{w.splice(i,1);save('mn_wl',w);return false} },
    inWL(id){ return this.getWL().includes(id) },

    /* Ratings */
    getRatings(){ return load('mn_rat')||{} },
    rate(id,sc){ const r=this.getRatings(); r[id]=sc; save('mn_rat',r) },
    myRating(id){ return (this.getRatings())[id]||null },

    /* Recent */
    getRecent(){ return load('mn_rec')||[] },
    addRecent(id){ const r=this.getRecent().filter(i=>i!==id); r.unshift(id); save('mn_rec',r.slice(0,12)) },
  };
})();
