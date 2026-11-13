
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("projects-container");
  const categoryFilter = document.getElementById("category-filter");
  const statusFilter = document.getElementById("status-filter");
  const resetButton = document.getElementById("reset-filters");
  const countElement = document.getElementById("projects-count");
  const emptyElement = document.getElementById("projects-empty");
  const errorElement = document.getElementById("projects-error");

  if (
    !container ||
    !categoryFilter ||
    !statusFilter ||
    !resetButton
  ) return;

  const language = document.documentElement.lang === "en" ? "en" : "pt";

  const labels = {
    pt: {
      category: {
        networking: "Networking",
        linux: "Linux",
        automation: "Automação"
      },
      status: {
        planned: "Planeado",
        "in-progress": "Em desenvolvimento",
        completed: "Concluído",
        archived: "Arquivado"
      },
      technologies: "Tecnologias",
      details: "Estudo de caso disponível",
      unavailable: "Estudo de caso em preparação",
      count: (n) => `${n} projecto(s) encontrado(s)`,
      error: "Não foi possível carregar os projectos."
    },
    en: {
      category: {
        networking: "Networking",
        linux: "Linux",
        automation: "Automation"
      },
      status: {
        planned: "Planned",
        "in-progress": "In Progress",
        completed: "Completed",
        archived: "Archived"
      },
      technologies: "Technologies",
      details: "View case study",
      unavailable: "Case study in preparation",
      count: (n) => `${n} project(s) found`,
      error: "Projects could not be loaded."
    }
  };

  const text = labels[language];
  let projects = [];

  function createElement(tag, className, content) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;

    return element;
  }

  function createProjectCard(project) {
    const card = createElement("article", "project-card");

    const header = createElement("div", "project-card__header");

    const category = createElement(
      "span",
      "badge",
      text.category[project.category] || project.category
    );

    const status = createElement(
      "span",
      `project-status project-status--${project.status}`,
      text.status[project.status] || project.status
    );

    header.append(category, status);

    const title = createElement(
      "h3",
      "project-card__title",
      project.title[language]
    );

    const description = createElement(
      "p",
      "project-card__description",
      project.description[language]
    );

    const technologies = createElement(
      "div",
      "project-card__technologies"
    );

    const techHeading = createElement(
      "p",
      "project-card__label",
      text.technologies
    );

    const techList = createElement(
      "div",
      "skills-tags"
    );

    project.technologies.forEach(technology => {
      techList.appendChild(
        createElement("span", "badge", technology)
      );
    });

    technologies.append(techHeading, techList);

    const footer = createElement("div", "project-card__footer");

    if (project.caseStudy && project.caseStudy[language]) {
      const link = createElement(
        "a",
        "button button--text",
        text.details
      );

      link.href = project.caseStudy[language];
      footer.appendChild(link);
    } else {
      footer.appendChild(
        createElement("span", "project-card__availability", text.unavailable)
      );
    }

    card.append(header, title, description, technologies, footer);

    return card;
  }

  function renderProjects() {
    const selectedCategory = categoryFilter.value;
    const selectedStatus = statusFilter.value;

    const filtered = projects.filter(project => {
      const matchesCategory =
        selectedCategory === "all" ||
        project.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" ||
        project.status === selectedStatus;

      return matchesCategory && matchesStatus;
    });

    container.replaceChildren();

    filtered.forEach(project => {
      container.appendChild(createProjectCard(project));
    });

    countElement.textContent = text.count(filtered.length);
    emptyElement.hidden = filtered.length !== 0;
  }

  async function loadProjects() {
    try {
      const response = await fetch("../data/projects.json");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid projects data");
      }

      projects = data.filter(project =>
        project.id &&
        project.category &&
        project.status &&
        project.title?.[language] &&
        project.description?.[language] &&
        Array.isArray(project.technologies)
      );

      renderProjects();

    } catch (error) {
      console.error("Project loading error:", error);

      container.replaceChildren();
      countElement.textContent = text.error;
      emptyElement.hidden = true;
      errorElement.hidden = false;
    }
  }

  categoryFilter.addEventListener("change", renderProjects);
  statusFilter.addEventListener("change", renderProjects);

  resetButton.addEventListener("click", () => {
    categoryFilter.value = "all";
    statusFilter.value = "all";
    renderProjects();
  });

  loadProjects();
});
