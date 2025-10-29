
const STORAGE = "resume_pro_templates_v2";

function saveForm(formId){
  const form = document.getElementById(formId);
  if(!form) return;
  const data = load();
  new FormData(form).forEach((v,k)=> data[k]=v );
  localStorage.setItem(STORAGE, JSON.stringify(data));
  alert("Saved locally.");
  renderPreview();
}

function load(){ try{ return JSON.parse(localStorage.getItem(STORAGE))||{} }catch(e){return{}} }

function populateForms(){
  const data = load();
  ['personalForm','educationForm','skillsForm','projectsForm'].forEach(id=>{
    const form = document.getElementById(id);
    if(!form) return;
    Object.keys(data).forEach(k=>{
      const el = form.querySelector(`[name="${k}"]`);
      if(el) el.value = data[k];
    });
  });
  if(data.photoDataUrl){
    const imgs = document.querySelectorAll('.photoPreviewImg');
    imgs.forEach(i=>i.src = data.photoDataUrl);
  }
  if(data.template) selectTemplate(data.template);
}

function handlePhoto(input){
  const file = input.files && input.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    const data = load(); data.photoDataUrl = reader.result; localStorage.setItem(STORAGE, JSON.stringify(data));
    document.querySelectorAll('.photoPreviewImg').forEach(i=>i.src = reader.result);
    renderPreview();
  };
  reader.readAsDataURL(file);
}

function selectTemplate(name, el){
  document.body.classList.remove('neo','minimal','portfolio','creative');
  if(name==='neo' || name==='minimal' || name==='portfolio' || name==='creative') document.body.classList.add(name);
  document.querySelectorAll('.template-thumb').forEach(t=>t.classList.remove('selected'));
  if(el) el.classList.add('selected');
  const data = load(); data.template = name; localStorage.setItem(STORAGE, JSON.stringify(data));
  renderPreview();
}

function renderPreview(){
  const data = load();
  const tpl = data.template || 'neo';
  const html = (tpl==='neo')? renderNeo(data) : (tpl==='minimal')? renderMinimal(data) : (tpl==='portfolio')? renderPortfolio(data) : renderCreative(data);
  const container = document.getElementById('resumeContainer');
  container.innerHTML = html;
}

function renderNeo(d){
  const photo = d.photoDataUrl? `<div class="photo"><img class="photoPreviewImg" src="${d.photoDataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:8px"></div>` : '';
  const skills = (d.skills||'').split(',').filter(Boolean).map(s=>`<div class="chip">${s.trim()}</div>`).join('');
  const hobbies = (d.hobbies||'').split(',').filter(Boolean).map(h=>`<div class="small">${h.trim()}</div>`).join('');
  const languages = (d.languages||'').split(',').filter(Boolean).map(l=>`<div class="small">${l.trim()}</div>`).join('');
  const social = (d.social||'').split(',').filter(Boolean).map(s=>`<div class="small">${s.trim()}</div>`).join('');
  const education = (d.education||'').split('\n').filter(Boolean).map(e=>`<div class="small section">${e}</div>`).join('');
  const projects = (d.projects||'').split('\n').filter(Boolean).map(p=>`<div class="small section">${p}</div>`).join('');
  return `
  <div class="resume-output neo card">
    <div class="header">
      <div><div class="name">${d.name||'Your Name'}</div><div class="small">${d.title||''}</div></div>
      ${photo}
    </div>
    <div class="two-col">
      <div>
        <div class="section"><strong>Objective</strong><div class="small">${d.objective||''}</div></div>
        <div class="section"><strong>Education</strong>${education}</div>
        <div class="section"><strong>Projects</strong>${projects}</div>
      </div>
      <aside class="aside card">
        <div><strong>Contact</strong><div class="small">${d.email||''} ${d.phone?(' • '+d.phone):''}</div></div>
        <div style="margin-top:12px"><strong>Skills</strong><div class="chips">${skills}</div></div>
        <div style="margin-top:12px"><strong>Languages</strong>${languages}</div>
        <div style="margin-top:12px"><strong>Hobbies</strong>${hobbies}</div>
        <div style="margin-top:12px"><strong>Social</strong>${social}</div>
      </aside>
    </div>
  </div>`;
}

function renderMinimal(d){
  const skills = (d.skills||'').split(',').filter(Boolean).map(s=>`<span class="chip">${s.trim()}</span>`).join(' ');
  const education = (d.education||'').split('\n').filter(Boolean).map(e=>`<div class="small">${e}</div>`).join('');
  const projects = (d.projects||'').split('\n').filter(Boolean).map(p=>`<div class="small">${p}</div>`).join('');
  return `
  <div class="resume-output minimal card">
    <div class="left">
      <div class="name">${d.name||'Your Name'}</div>
      <div class="small">${d.title||''}</div>
    </div>
    <div class="section"><strong>Objective</strong><div class="small">${d.objective||''}</div></div>
    <div class="section"><strong>Education</strong>${education}</div>
    <div class="section"><strong>Projects</strong>${projects}</div>
    <div class="section"><strong>Skills</strong><div class="small">${skills}</div></div>
    <div class="section"><strong>Languages</strong><div class="small">${d.languages||''}</div></div>
    <div class="section"><strong>Hobbies</strong><div class="small">${d.hobbies||''}</div></div>
    <div class="section"><strong>Social</strong><div class="small">${d.social||''}</div></div>
  </div>`;
}

function renderPortfolio(d){
  const photo = d.photoDataUrl? `<div class="photo"><img class="photoPreviewImg" src="${d.photoDataUrl}" style="width:100%;height:100%;object-fit:cover"></div>` : '';
  const projects = (d.projects||'').split('\n').filter(Boolean).map(p=>`<div class="card-small">${p}</div>`).join('');
  return `
  <div class="resume-output portfolio card">
    <div class="header">
      <div style="flex:1"><div class="name">${d.name||'Your Name'}</div><div class="small">${d.title||''}</div></div>
      ${photo}
    </div>
    <div class="section"><strong>Objective</strong><div class="small">${d.objective||''}</div></div>
    <div class="projects"><h4>Projects</h4>${projects}</div>
    <div style="margin-top:12px"><strong>Skills</strong><div class="chips">${(d.skills||'').split(',').filter(Boolean).map(s=>`<div class="chip">${s.trim()}</div>`).join('')}</div></div>
    <div style="margin-top:12px"><strong>Contact & Social</strong><div class="small">${d.email||''} ${d.phone?(' • '+d.phone):''} <div>${d.social||''}</div></div></div>
  </div>`;
}

function renderCreative(d){
  const skills = (d.skills||'').split(',').filter(Boolean).map(s=>`<div class="chip">${s.trim()}</div>`).join('');
  return `
  <div class="resume-output creative card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div><div class="name">${d.name||'Your Name'}</div><div class="small">${d.title||''}</div></div>
      <div class="accent">Creative</div>
    </div>
    <div class="section"><strong>Objective</strong><div class="small">${d.objective||''}</div></div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start"><div style="flex:1"><strong>Projects</strong><div class="small">${(d.projects||'').replace(/\n/g,'<div class=\"small\">')}</div></div><aside style="width:220px" class="card"><strong>Skills</strong><div class="chips">${skills}</div><div style="margin-top:8px"><strong>Languages</strong><div class="small">${d.languages||''}</div></div><div style="margin-top:8px"><strong>Hobbies</strong><div class="small">${d.hobbies||''}</div></div></aside></div>
  </div>`;
}

// Exports
function downloadHTML(){
  const resume = document.getElementById('resumeContainer');
  if(!resume) return alert('No resume to download');
  const content = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Resume</title><style>'+document.getElementById('embedCSS').textContent+'</style></head><body>'+resume.outerHTML+'</body></html>';
  const blob = new Blob([content], {type: 'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = (document.querySelector('.name')?.textContent||'resume') + '.html'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function downloadWord(){
  const resume = document.getElementById('resumeContainer');
  if(!resume) return alert('No resume');
  const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>";
  const footer = "</html>";
  const content = header + "<head><meta charset='utf-8'><title>Resume</title></head><body>" + resume.innerHTML + "</body>" + footer;
  const blob = new Blob(['\ufeff', content], {type: 'application/msword'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = (document.querySelector('.name')?.textContent||'resume') + '.doc'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function printPDF(){ window.print(); }

document.addEventListener('DOMContentLoaded', ()=>{
  populateForms();
  renderPreview();
  document.querySelectorAll('.template-thumb').forEach(t=> t.addEventListener('click', ()=> selectTemplate(t.dataset.tpl, t)));
});