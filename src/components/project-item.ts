// Individual Project Element handled

import Component from "./base-component.js";
import { AutoBind } from "../decorators/autobind.js";
import { Project } from "../models/project-model.js";

import {} from "./base-component.js";
import { Draggable } from "../models/drag-drop-interface.js";
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  // getter is called without parantheses - check - i.e. this.person
  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }
  constructor(hostId: string, project: Project) {
    super("single-project", hostId, true, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @AutoBind
  dragStartHandler(event: DragEvent) {
    // event.dataTransfer.<name_of_choice> - send data transfer i.e. id
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_event: DragEvent) {
    console.log("Drag end");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }
  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
