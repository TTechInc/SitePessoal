let resources = [];
let visibleCount = 2;

function normalizeText(text){
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

fetch('recursos.json')
  .then(res => res.json())
  .then(data => {
    resources = data;
    renderResources();
  });

function renderResources(){
  const search = normalizeText(document.getElementById('searchInput').value);
  const tag = document.getElementById('tagFilter').value;
  const sort = document.getElementById('sortFilter').value;

  let filtered = resources.filter(r =>
    normalizeText(r.title).includes(search) &&
    (!tag || r.tags.includes(tag))
  );

  filtered.sort((a,b)=>{
    if(sort==='recent') return new Date(b.date)-new Date(a.date);
    if(sort==='old') return new Date(a.date)-new Date(b.date);
    if(sort==='title') return a.title.localeCompare(b.title);
  });

  const container = document.getElementById('resourcesList');
  container.innerHTML = '';

  filtered.slice(0, visibleCount).forEach(resource=>{
    const tags = resource.tags.map(t=>`<span class="tag">${t}</span>`).join(' ');

    container.innerHTML += `
      <div class="card">
        <h4>${resource.title}</h4>
        <p>${resource.description}</p>
        <div class="tags">${tags}</div>
        <a href="${resource.link}" class="btn-primary" download>Download</a>
      </div>
    `;
  });

  document.getElementById('loadMoreBtn').style.display =
    visibleCount >= filtered.length ? 'none' : 'inline-flex';
}

document.querySelectorAll('input, select').forEach(el=>{
  el.addEventListener('input', ()=>{
    visibleCount = 2;
    renderResources();
  });
});

document.getElementById('loadMoreBtn').addEventListener('click', ()=>{
  visibleCount += 3;
  renderResources();
});