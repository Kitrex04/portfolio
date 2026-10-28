export type Language = 'ES' | 'EN';

export interface Translations {
  code: string;
  locCity: string;
  findMeOn: string;
  navHome: string;
  navContact: string;
  navProjects: string;
  navStack: string;
  stackTag: string;
  stackTitle: string;
  stackDesc: string;
  sphereHint: string;
  title: string;
  subtitle: string;
  flip: string;
  scroll: string;
  contactTag: string;
  contactTitle: string;
  contactDesc: string;
  emailLabel: string;
  copy: string;
  copied: string;
  socialsLabel: string;
  projectsTag: string;
  projectsTitle: string;
  projectsDesc: string;
  viewProject: string;
  spotifyTitle: string;
  spotifyDesc: string;
  directEmailCta: string;
  availableProjects: string;
}

export interface TechItem {
  id: string;
  name: string;
  icon: string;
  category: 'frontend' | 'tools' | 'languages' | 'specialty';
  brandColor: string;
  hoverClass: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  tags: { name: string; class: string }[];
  repoUrl: string;
  liveUrl: string;
}
