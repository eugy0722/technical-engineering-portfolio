
document.addEventListener("DOMContentLoaded", async () => {

    const language = document.documentElement.lang === "en" ? "en" : "pt";

    const container = document.getElementById("certifications-container");
    const categoryFilter = document.getElementById("category-filter");
    const issuerFilter = document.getElementById("issuer-filter");
    const resetButton = document.getElementById("reset-filters");

    const countElement = document.getElementById("certifications-count");
    const emptyMessage = document.getElementById("certifications-empty");
    const errorMessage = document.getElementById("certifications-error");

    const totalElement = document.getElementById("total-certifications");
    const trainingElement = document.getElementById("total-training");
    const professionalElement = document.getElementById("total-professional");

    const translations = {
        pt: {
            completed: "Formação concluída",
            obtained: "Certificação obtida",
            inProgress: "Em andamento",
            credential: "Credencial",
            issuedBy: "Entidade emissora",
            completedOn: "Data de conclusão / obtenção",
            verification: "Verificar credencial",
            records: "registos encontrados",
            invalidDate: "Data por confirmar",
            invalidData: "Alguns registos possuem dados incompletos.",
            loadingError: "Não foi possível carregar os registos."
        },
        en: {
            completed: "Training completed",
            obtained: "Certification obtained",
            inProgress: "In progress",
            credential: "Credential",
            issuedBy: "Issuing organization",
            completedOn: "Completion / issue date",
            verification: "Verify credential",
            records: "records found",
            invalidDate: "Date to be confirmed",
            invalidData: "Some records contain incomplete data.",
            loadingError: "Unable to load records."
        }
    };

    const t = translations[language];

    let certifications = [];

    // =====================================
    // ELEMENT HELPERS
    // =====================================

    function createElement(tag, className, text) {

        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    // =====================================
    // DATE VALIDATION
    // =====================================

    function isValidDate(value) {

        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
            return false;
        }

        const [year, month, day] = value.split("-").map(Number);

        const date = new Date(Date.UTC(year, month - 1, day));

        return (
            date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day
        );
    }

    function formatDate(value) {

        if (!isValidDate(value)) {
            return t.invalidDate;
        }

        const [year, month, day] = value.split("-").map(Number);

        const date = new Date(year, month - 1, day, 12);

        return new Intl.DateTimeFormat(
            language === "pt" ? "pt-PT" : "en-GB",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        ).format(date);
    }

    // =====================================
    // DATA NORMALIZATION
    // =====================================

    function normalizeCertification(item) {

        const normalized = { ...item };

        // Compatibility with the previous category value.
        if (normalized.category === "profissional-training") {
            normalized.category = "completed-training";
        }

        return normalized;
    }

    // =====================================
    // LABELS
    // =====================================

    function getStatusLabel(status) {

        const labels = {
            completed: t.completed,
            obtained: t.obtained,
            "in-progress": t.inProgress
        };

        return labels[status] || status;
    }

    function getCategoryLabel(category) {

        const labels = {
            "professional-certification": language === "pt"
                ? "Certificação profissional"
                : "Professional certification",

            "completed-training": language === "pt"
                ? "Formação concluída"
                : "Completed training",

            "in-progress-training": language === "pt"
                ? "Formação em andamento"
                : "In-progress training"
        };

        return labels[category] || category;
    }

    // =====================================
    // CARD CREATION
    // =====================================

    function createCard(item) {

        const card = createElement("article", "certification-card");

        const header = createElement(
            "div",
            "certification-card__header"
        );

        header.appendChild(
            createElement(
                "span",
                "certification-category",
                getCategoryLabel(item.category)
            )
        );

        header.appendChild(
            createElement(
                "span",
                `certification-status certification-status--${item.status}`,
                getStatusLabel(item.status)
            )
        );

        card.appendChild(header);

        card.appendChild(
            createElement(
                "h3",
                "certification-card__title",
                item.name[language]
            )
        );

        card.appendChild(
            createElement(
                "p",
                "certification-card__description",
                item.description[language]
            )
        );

        const metadata = createElement(
            "div",
            "certification-card__metadata"
        );

        metadata.appendChild(
            createElement("span", "metadata-label", t.issuedBy)
        );

        metadata.appendChild(
            createElement("strong", "metadata-value", item.issuer)
        );

        metadata.appendChild(
            createElement("span", "metadata-label", t.completedOn)
        );

        metadata.appendChild(
            createElement(
                "strong",
                "metadata-value",
                formatDate(item.date)
            )
        );

        if (item.credentialId) {

            metadata.appendChild(
                createElement("span", "metadata-label", t.credential)
            );

            metadata.appendChild(
                createElement(
                    "code",
                    "credential-value",
                    item.credentialId
                )
            );
        }

        card.appendChild(metadata);

        if (
            item.verificationUrl &&
            /^https:\/\//i.test(item.verificationUrl)
        ) {

            const link = createElement(
                "a",
                "certification-verification",
                t.verification
            );

            link.href = item.verificationUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            card.appendChild(link);
        }

        return card;
    }

    // =====================================
    // FILTERS
    // =====================================

    function populateIssuerFilter() {

        const issuers = [
            ...new Set(certifications.map(item => item.issuer))
        ].sort();

        issuerFilter.replaceChildren();

        const defaultOption = createElement(
            "option",
            "",
            language === "pt"
                ? "Todas as entidades"
                : "All organizations"
        );

        defaultOption.value = "all";

        issuerFilter.appendChild(defaultOption);

        issuers.forEach(issuer => {

            const option = createElement("option", "", issuer);

            option.value = issuer;

            issuerFilter.appendChild(option);
        });
    }

    function renderCertifications() {

        const selectedCategory = categoryFilter.value;
        const selectedIssuer = issuerFilter.value;

        const filtered = certifications
            .filter(item => {

                const matchesCategory =
                    selectedCategory === "all" ||
                    item.category === selectedCategory;

                const matchesIssuer =
                    selectedIssuer === "all" ||
                    item.issuer === selectedIssuer;

                return matchesCategory && matchesIssuer;
            })
            .sort((a, b) => {

                const dateA = isValidDate(a.date) ? a.date : "";
                const dateB = isValidDate(b.date) ? b.date : "";

                return dateB.localeCompare(dateA);
            });

        container.replaceChildren();

        filtered.forEach(item => {
            container.appendChild(createCard(item));
        });

        emptyMessage.hidden = filtered.length > 0;

        countElement.textContent =
            `${filtered.length} ${t.records}`;
    }

    // =====================================
    // SUMMARY
    // =====================================

    function updateSummary() {

        totalElement.textContent = certifications.length;

        trainingElement.textContent = certifications.filter(
            item => item.category === "completed-training"
        ).length;

        professionalElement.textContent = certifications.filter(
            item => item.category === "professional-certification"
        ).length;
    }

    // =====================================
    // EVENT LISTENERS
    // Register BEFORE loading JSON.
    // =====================================

    categoryFilter.addEventListener("change", renderCertifications);

    issuerFilter.addEventListener("change", renderCertifications);

    resetButton.addEventListener("click", () => {

        categoryFilter.value = "all";
        issuerFilter.value = "all";

        renderCertifications();

    });

    // =====================================
    // LOAD DATA
    // =====================================

    try {

        const response = await fetch("../data/certifications.json");

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid JSON data structure");
        }

        certifications = data
            .map(normalizeCertification)
            .filter(item =>
                item.id &&
                item.name?.[language] &&
                item.description?.[language] &&
                item.issuer &&
                item.category &&
                item.status
            );

        populateIssuerFilter();

        updateSummary();

        renderCertifications();

        errorMessage.hidden = true;

    } catch (error) {

        console.error(
            "Certifications loading error:",
            error
        );

        container.replaceChildren();

        errorMessage.hidden = false;
        errorMessage.textContent = t.loadingError;

    }

    // =====================================
    // FOOTER
    // =====================================

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

});
