// Project State Management

import { Project, ProjectStatus } from "../models/project-model";

type Listener<T> = (items: T[]) => void;

// Base State Class
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListeners(listnerFn: Listener<T>) {
    this.listeners.push(listnerFn);
  }
}

// Project State
export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }

  addProject(title: string, description: string, noOfPeople: number) {
    // Pass the function of data to projects
    const newProject = new Project(
      Date.now().toString(),
      title,
      description,
      noOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listnerFn of this.listeners) {
      listnerFn(this.projects.slice()); // slice is added to send copy of array
    }
  }
}

// Private Constructor - Singleton
export const projectState = ProjectState.getInstance();
