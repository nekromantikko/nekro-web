import './style.css';
import { startRenderer } from './ascii-renderer';
import { projects, type Project } from './projects';

const outputEl = document.getElementById('ascii-output')!;
startRenderer(outputEl);

const projectsEl = document.getElementById('projects')!;
renderProjects(projects, projectsEl);

const lightbox = document.getElementById('lightbox') as HTMLDialogElement;
const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
});

function openLightbox(src: string, alt: string) {
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.showModal();
}

function renderProjects(items: Project[], container: HTMLElement) {
    for (const project of items) {
        const article = document.createElement('article');
        article.className = 'project';

        const titleContainer = document.createElement('div');
        titleContainer.className = 'project-title-container';

        const title = document.createElement('h3');
        title.className = 'project-title';
        title.textContent = project.title;

        if (project.wip) {
            const wip = document.createElement('span');
            wip.className = 'project-wip';
            wip.textContent = '[wip]';
            title.appendChild(wip);
        }

        titleContainer.appendChild(title);

        const year = document.createElement('p');
        year.className = 'project-year';
        year.textContent = project.year;

        titleContainer.appendChild(year);

        const tags = document.createElement('p');
        tags.className = 'project-tags';
        tags.textContent = project.tags.map(t => `[${t}]`).join(' ');

        const desc = document.createElement('p');
        desc.className = 'project-description';
        desc.textContent = project.description;

        const links = document.createElement('div');
        links.className = 'project-links';
        for (const link of project.links) {
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.label;
            a.target = '_blank';
            a.rel = 'noreferrer';
            links.appendChild(a);
        }

        article.appendChild(titleContainer);
        article.appendChild(tags);
        article.appendChild(desc);

        if (project.images && project.images.length > 0) {
            const thumbnails = document.createElement('div');
            thumbnails.className = 'project-thumbnails';
            for (const src of project.images) {
                const img = document.createElement('img');
                img.className = 'project-thumbnail';
                img.src = src;
                img.alt = project.title;
                img.addEventListener('click', () => openLightbox(src, project.title));
                thumbnails.appendChild(img);
            }
            article.appendChild(thumbnails);
        }

        article.appendChild(links);
        container.appendChild(article);
    }
}
