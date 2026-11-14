# Technical Engineering Portfolio

**Technical Engineering by Eugênio Kaxinga**

> Learn. Build. Document. Engineer.

A bilingual professional portfolio focused on Telecommunications Engineering, Computer Networking, IT Infrastructure, Linux Administration and Network Automation.

---

## 1. Project Overview

The **Technical Engineering Portfolio** is a personal professional website designed to present technical knowledge, academic background, certifications, practical projects and technical publications.

Its purpose is to transform learning and hands-on practice into structured, documented and verifiable technical evidence.

The portfolio follows an evidence-based approach: it distinguishes theoretical knowledge, laboratory practice, project implementation and professional experience.

**Professional positioning:** Aspiring Network & Infrastructure Engineer.

## 2. Objectives

- Present academic and technical qualifications.
- Demonstrate networking and infrastructure knowledge through practical projects.
- Document technical implementations, architectures and troubleshooting processes.
- Share technical articles and learning experiences.
- Provide professional contact information and access to relevant profiles.
- Maintain a bilingual experience in Portuguese and English.

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Responsive design and visual system |
| JavaScript | Navigation, filters and dynamic content |
| JSON | Static project, certification and article data |
| Git | Version control |
| GitHub | Source code hosting |
| GitHub Actions | Continuous Integration and Deployment |
| GitHub Pages | Static website hosting |

The initial implementation intentionally avoids backend services, databases, content management systems and frontend frameworks.

## 4. Architecture

The project follows a static, modular and bilingual architecture.

- Independent Portuguese and English page directories.
- Shared CSS and JavaScript resources.
- JSON files for structured content.
- Individual HTML pages for technical case studies and articles.
- Automated production build and GitHub Pages deployment.

### Repository Structure

```text
technical-engineering-portfolio/
├── index.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── CNAME
├── README.md
├── package.json
├── package-lock.json
├── pt/
│   ├── index.html
│   ├── about.html
│   ├── skills.html
│   ├── projects.html
│   ├── certifications.html
│   ├── blog.html
│   ├── contact.html
│   └── projects/
├── en/
│   ├── index.html
│   ├── about.html
│   ├── skills.html
│   ├── projects.html
│   ├── certifications.html
│   ├── blog.html
│   ├── contact.html
│   └── projects/
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── documents/
│   └── diagrams/
├── data/
│   ├── projects.json
│   ├── certifications.json
│   └── articles.json
├── scripts/
│   └── build.mjs
└── .github/
    └── workflows/
        └── deploy.yml
```

*Note: `CNAME` is only required when a custom domain is configured.*

## 5. Main Sections

| Section | Description |
|---|---|
| Home | Professional introduction and featured content |
| About | Academic background and professional journey |
| Skills | Technical knowledge and areas of focus |
| Projects | Practical engineering and laboratory projects |
| Certifications | Professional certifications and completed training |
| Technical Blog | Technical articles and learning documentation |
| Contact | Professional communication channels |

## 6. Featured Technical Work

The portfolio includes practical work and technical studies in areas such as:

- **Super-Lab Ethernet:** Ethernet infrastructure expansion, VLAN segmentation, gateway redundancy and inter-network routing.
- **Linux Permissions:** Practical study of POSIX permissions, users, groups, ownership and access control.
- **Network Automation:** Learning and exploration of network programmability and automation.

Project status and implementation details are documented individually. Laboratory work is not presented as production or enterprise operational experience.

## 7. Local Development

### Requirements

- Git
- Node.js 22 or compatible version
- npm
- Python 3 (for local HTTP testing)

### Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/technical-engineering-portfolio.git

cd technical-engineering-portfolio
```

### Install dependencies

```bash
npm ci
```

### Run the development website

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/
```

Portuguese and English pages are available under `/pt/` and `/en/`.

### Generate a production build

```bash
npm run build
```

The optimised static website is generated in:

```text
dist/
```

To test the production output locally:

```bash
python3 -m http.server 8000 --directory dist
```

## 8. Continuous Integration and Deployment

GitHub Actions automates the production workflow.

The deployment pipeline includes:

1. Repository checkout.
2. Node.js environment setup.
3. Dependency installation.
4. JSON and required-file validation.
5. HTML, CSS, JavaScript and JSON optimisation.
6. Production artifact generation.
7. GitHub Pages deployment.

Pull requests trigger validation and build operations. Changes pushed to the `main` branch trigger the deployment workflow.

## 9. Production and SEO

The production setup includes:

- `robots.txt` for search engine crawling instructions.
- `sitemap.xml` for public page discovery.
- Custom 404 page.
- HTTPS through GitHub Pages.
- Optimised static assets.
- Responsive layouts.
- Semantic HTML and accessibility considerations.

## 10. Design Principles

The visual identity follows a Corporate Engineering direction.

| Design Token | Value |
|---|---|
| Deep Navy | `#142B46` |
| Engineering Blue | `#2679B9` |
| Light Gray | `#F3F6FA` |
| Charcoal | `#253342` |
| White | `#FFFFFF` |

Typography:

- Inter — interface and general content.
- JetBrains Mono — technical commands and code.

The interface prioritises clarity, consistency, readability and responsive behaviour.

## 11. Development Status

The portfolio is being developed incrementally.

The project prioritises:

- Accurate technical representation.
- Verifiable practical evidence.
- Clear documentation.
- Maintainable architecture.
- Continuous improvement.

Features and content are only considered complete after implementation and validation.

## 12. Future Improvements

Potential future enhancements include:

- Additional documented engineering case studies.
- Published technical articles.
- Expanded accessibility and performance audits.
- Improved automated testing.
- Further image and font optimisation.
- Additional technical demonstrations.

## 13. Author

**Eugênio Kaxinga**

Aspiring Network & Infrastructure Engineer  
Telecommunications Engineering Student

Areas of focus:

- Computer Networking
- IT Infrastructure
- Linux Administration
- Network Security
- Network Automation

---

**Technical Engineering by Eugênio Kaxinga**

*Learn. Build. Document. Engineer.*