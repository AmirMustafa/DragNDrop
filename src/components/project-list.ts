// Listing Section handled

/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../state/project-state.ts" />
/// <reference path="../models/project-model.ts" />
/// <reference path="../models/drag-drop-interface.ts" />
namespace App {
  export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
    assignedProject: Project[];

    private renderProjects() {
      const listEl = document.getElementById(
        `${this.type}-project-lists`
      )! as HTMLUListElement;

      listEl.innerHTML = ""; // to avoid duplicate entry
      for (const prjItem of this.assignedProject) {
        new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
        // const listItem = document.createElement("li");
        // listItem.textContent = prjItem.title;
        // listEl.appendChild(listItem);
      }
    }

    constructor(private type: "active" | "finished") {
      super("project-list", "app", false, `${type}-projects`);

      this.assignedProject = [];

      this.configure();
      this.renderContent();
    }

    @AutoBind
    dragOverHandler(event: DragEvent): void {
      // Checking if data is sent from dragStartHandler method
      if (event.dataTransfer?.types[0] === "text/plain") {
        event.preventDefault(); // prevent default is must to execute drop
        const listEl = this.element.querySelector("ul");
        listEl?.classList.add("droppable");
      }
    }
    @AutoBind
    dropHandler(event: DragEvent): void {
      // Receive data transfered i.e. id
      const prjId = event.dataTransfer?.getData("text/plain");
      if (prjId) {
        projectState.moveProject(
          prjId,
          this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
        );
      }
    }

    @AutoBind
    dragLeaveHandler(_event: DragEvent): void {
      const listEl = this.element.querySelector("ul");
      listEl?.classList.remove("droppable");
    }

    configure() {
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);

      projectState.addListeners((projects: Project[]) => {
        // filter projects
        const relevantProjects = projects.filter((prj) => {
          if (this.type === "active") {
            return prj.status === ProjectStatus.Active;
          }

          return prj.status === ProjectStatus.Finished;
        });
        this.assignedProject = relevantProjects;
        this.renderProjects();
      });
    }

    renderContent() {
      const listId = `${this.type}-project-lists`;
      this.element.querySelector("ul")!.id = listId;
      this.element.querySelector("h2")!.textContent =
        this.type.toUpperCase() + " PROJECTS";
    }
  }
}
