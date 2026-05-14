let articles = [];
let visibleCount = 2;

fetch('artigos.json')
  .then(res => res.json())
  .then(data => {
    articles = data;
    renderArticles();
  })
  .catch(err => console.error("Erro a carregar JSON:", err));

function normalizeText(text){
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function renderArticles(){
  const search = normalizeText(document.getElementById('searchInput').value);
  const tag = document.getElementById('tagFilter').value;
  const author = document.getElementById('authorFilter').value;
  const sort = document.getElementById('sortFilter').value;

  let filtered = articles.filter(a =>
    normalizeText(a.title).includes(search) &&
    (!tag || a.tags.includes(tag)) &&
    (!author || a.author === author)
  );

  filtered.sort((a,b)=>{
    if(sort==='recent') return new Date(b.date)-new Date(a.date);
    if(sort==='old') return new Date(a.date)-new Date(b.date);
    if(sort==='title') return a.title.localeCompare(b.title);
  });

  const container = document.getElementById('articlesList');
  container.innerHTML='';

  filtered.slice(0, visibleCount).forEach(article=>{
    const tags = article.tags.map(t=>`<span class="tag">${t}</span>`).join(' ');
    container.innerHTML += `
      <div class="card">
        <h4>${article.title}</h4>
        <p>${article.description}</p>
        <div class="tags">${tags}</div>
        <a href="${article.link}" class="btn-primary article-btn">Ler artigo</a>
      </div>`;
  });

  document.getElementById('loadMoreBtn').style.display =
    visibleCount >= filtered.length ? 'none' : 'inline-flex';
}

document.querySelectorAll('input, select').forEach(el=>{
  el.addEventListener('input', ()=>{
    visibleCount = 2;
    renderArticles();
  });
});

document.getElementById('loadMoreBtn').addEventListener('click', ()=>{
  visibleCount += 5;
  renderArticles();
});

