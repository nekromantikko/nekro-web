export type ProjectLink = {
    label: string;
    url: string;
};

export type Project = {
    title: string;
    year: string;
    wip?: boolean;
    description: string;
    tags: string[];
    links: ProjectLink[];
    images?: string[];
};

export const projects: Project[] = [
    {
        title: 'Office Horror',
        year: '2024',
        description: 'A short horror game made for Retro Game Jam 2024 over a weekend. Built with libdragon, targeting real N64 hardware and compatible emulators. I was responsible for all of the art assets, pathfinding and collision code among other things.',
        tags: ['N64', 'C', 'libdragon', 'game jam'],
        links: [{ label: 'itch.io', url: 'https://kepuligames.itch.io/office-horror' }],
        images: ['/img/projects/officehorror0.png', '/img/projects/officehorror1.png'],
    },
    {
        title: 'Glue Collaboration',
        year: '2018 — 2024',
        description: 'Virtual collaboration platform for virtual reality devices and desktop PCs. During my 6 years at Glue, I transitioned from 3D artist to Lead Developer / Lead Technical Artist. I worked as a full stack developer, and owned and architected the VR avatar system.',
        tags: ['Unity', '3D', 'virtual reality', 'SaaS'],
        links: [{ label: 'website', url: 'https://glue.work/' }],
    },
    {
        title: 'Witch Student Rig',
        year: '2020',
        description: 'A free character rig asset for animators released on Cubebrush. The character was designed, modeled, and rigged by me in Maya.',
        tags: ['3D', 'rigging'],
        links: [{ label: 'cubebrush', url: 'https://cubebrush.co/jp/products/8e5bwq/witch-student-rig-for-animators-marmoset-files' }, { label: 'artstation', url: 'https://www.artstation.com/artwork/9e2oJy' }],
        images: ['/img/projects/witchrig0.jpg'],
    },
    {
        title: 'NES Simulator',
        year: '2018',
        description: 'A silly little game inspired by the likes of Surgeon Simulator and QWOP, where you control a pair of thumbs to play NES games. Made with Unity with a C++ plugin for the NES emulator.',
        tags: ['Unity', 'C#', '3D', 'emulation'],
        links: [{ label: 'itch.io', url: 'https://nekromantikko.itch.io/nes-simulator-ver-01' }, { label: 'artstation', url: 'https://www.artstation.com/artwork/2NvEA'}],
        images: ['/img/projects/nes_simulator0.jpg'],
    },
    
];
