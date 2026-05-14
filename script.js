const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
});

document.querySelectorAll('.reveal').forEach((element) => {
  observer.observe(element);
});