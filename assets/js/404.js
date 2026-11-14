
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();

  const language = path.includes("/en/") ? "en" : "pt";

  const content = {
    pt: {
      title: "Página não encontrada.",
      description:
        "O endereço que procuras não existe, foi alterado ou encontra-se temporariamente indisponível.",
      eyebrow: "PÁGINA NÃO ENCONTRADA",
      home: "Voltar à página inicial",
      projects: "Explorar projectos",
      language: "English",
      homeUrl: "pt/",
      projectsUrl: "pt/projects.html",
      languageUrl: "en/"
    },

    en: {
      title: "Page not found.",
      description:
        "The address you are looking for does not exist, has been changed or is temporarily unavailable.",
      eyebrow: "PAGE NOT FOUND",
      home: "Back to homepage",
      projects: "Explore projects",
      language: "Português",
      homeUrl: "en/",
      projectsUrl: "en/projects.html",
      languageUrl: "pt/"
    }
  };

  const t = content[language];

  document.documentElement.lang = language;

  document.title = language === "en"
    ? "404 — Page Not Found | Technical Engineering"
    : "404 — Página não encontrada | Technical Engineering";

  document.getElementById("error-title").textContent = t.title;

  document.getElementById("error-description").textContent =
    t.description;

  document.querySelector(".error-eyebrow").textContent = t.eyebrow;

  const homeLink = document.getElementById("home-link");
  homeLink.textContent = t.home;
  homeLink.href = t.homeUrl;

  const projectsLink = document.getElementById("projects-link");
  projectsLink.textContent = t.projects;
  projectsLink.href = t.projectsUrl;

  const languageSwitch = document.getElementById("language-switch");
  languageSwitch.textContent = t.language;
  languageSwitch.href = t.languageUrl;

  document.getElementById("current-year").textContent =
    new Date().getFullYear();
});
