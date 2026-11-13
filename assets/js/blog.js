
document.addEventListener("DOMContentLoaded", () => {
  const language = document.documentElement.lang === "en" ? "en" : "pt";

  const container = document.getElementById("articles-container");
  const categoryFilter = document.getElementById("category-filter");
  const statusFilter = document.getElementById("status-filter");
  const resetButton = document.getElementById("reset-filters");
  const countElement = document.getElementById("articles-count");
  const emptyMessage = document.getElementById("articles-empty");
  const errorMessage = document.getElementById("articles-error");
  const yearElement = document.getElementById("current-year");

  const translations = {
    pt: {
      published: "Publicado",
      draft: "Em preparação",
      categories: {
        networking: "Networking",
        linux: "Linux",
        automation: "Automação",
        engineering: "Práticas de Engenharia"
      },
      count: (n) => `${n} ${n === 1 ? "artigo" : "artigos"}`,
      technologies: "Tecnologias",
      read: "Ler artigo",
      noLink: "Conteúdo em preparação",
      error: "Não foi possível carregar os artigos."
    },
    en: {
      published: "Published",
      draft: "In preparation",
      categories: {
        networking: "Networking",
        linux: "Linux",
        automation: "Automation",
        engineering: "Engineering Practices"
      },
      count: (n) => `${n} ${n === 1 ? "article" : "articles"}`,
      technologies: "Technologies",
      read: "Read article",
      noLink: "Content in preparation",
      error: "Articles could not be loaded."
    }
  };

  const t = translations[language];
  let articles = [];

  // Register event listeners before loading data.
  categoryFilter.addEventListener("change", renderArticles);
  statusFilter.addEventListener("change", renderArticles);

  resetButton.addEventListener("click", () => {
    categoryFilter.value = "all";
    statusFilter.value = "all";
    renderArticles();
  });

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
  }

  function renderArticle(article) {
    const card = createElement("article", "blog-card");

    const category = createElement(
      "span",
      "badge",
      t.categories[article.category] || article.category
    );

    const status = createElement(
      "span",
      `blog-status blog-status--${article.status}`,
      t[article.status] || article.status
    );

    const metadata = createElement("div", "blog-card__metadata");
    metadata.append(category, status);

    const title = createElement(
      "h3",
      "blog-card__title",
      article.title[language]
    );

    const description = createElement(
      "p",
      "blog-card__description",
      article.description[language]
    );

    const technologies = createElement("div", "blog-card__technologies");

    const techLabel = createElement(
      "span",
      "blog-card__tech-label",
      `${t.technologies}:`
    );

    technologies.appendChild(techLabel);

    article.technologies.forEach((technology) => {
      technologies.appendChild(
        createElement("span", "blog-tech", technology)
      );
    });

    card.append(metadata, title, description, technologies);

    const articleUrl = article.url?.[language];

    if (article.status === "published" && articleUrl) {
      const link = createElement(
        "a",
        "button button--text blog-card__link",
        t.read
      );

      link.href = articleUrl;
      card.appendChild(link);
    } else {
      card.appendChild(
        createElement("p", "blog-card__notice", t.noLink)
      );
    }

    return card;
  }

  function renderArticles() {
    const category = categoryFilter.value;
    const status = statusFilter.value;

    const filteredArticles = articles.filter((article) => {
      const matchesCategory =
        category === "all" || article.category === category;

      const matchesStatus =
        status === "all" || article.status === status;

      return matchesCategory && matchesStatus;
    });

    container.replaceChildren();

    filteredArticles.forEach((article) => {
      container.appendChild(renderArticle(article));
    });

    countElement.textContent = t.count(filteredArticles.length);

    emptyMessage.hidden = filteredArticles.length !== 0;
    errorMessage.hidden = true;
  }

  async function loadArticles() {
    try {
      const response = await fetch("../data/articles.json");

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid articles data.");
      }

      articles = data.filter((article) => {
        return (
          article &&
          typeof article.id === "string" &&
          typeof article.category === "string" &&
          ["published", "draft"].includes(article.status) &&
          article.title &&
          typeof article.title[language] === "string" &&
          article.description &&
          typeof article.description[language] === "string" &&
          Array.isArray(article.technologies)
        );
      });

      renderArticles();

    } catch (error) {
      console.error("Blog loading error:", error);

      container.replaceChildren();
      countElement.textContent = "0";
      emptyMessage.hidden = true;
      errorMessage.hidden = false;
    }
  }

  loadArticles();
});
