import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
    NAME: "tape4",
    EMAIL: "tape4_@naver.com",
    NUM_POSTS_ON_HOMEPAGE: 2,
    NUM_WORKS_ON_HOMEPAGE: 3,
    NUM_PROJECTS_ON_HOMEPAGE: 2,
};

export const HOME: Metadata = {
    TITLE: "Home",
    DESCRIPTION: "Blog and portfolio for tape4",
};

export const BLOG: Metadata = {
    TITLE: "Blog",
    DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const WORK: Metadata = {
    TITLE: "Experience",
    DESCRIPTION: "What I have done and what I am doing.",
};

export const PROJECTS: Metadata = {
    TITLE: "Projects",
    DESCRIPTION:
        "A collection of my projects, with links to repositories and demos.",
};

export const SOCIALS: Socials = [
    {
        NAME: "github",
        HREF: "https://github.com/tape4",
    },
    {
        NAME: "linkedin",
        HREF: "https://www.linkedin.com/in/jeonghoon-lee-302933358",
    },
];
