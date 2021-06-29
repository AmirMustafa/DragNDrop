// Base class which is having shared logic - added generics for better type casting
namespace App {
  export abstract class Component<
    T extends HTMLElement,
    U extends HTMLElement
  > {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
      this.templateElement = document.getElementById(
        templateId
      )! as HTMLTemplateElement;

      this.hostElement = document.getElementById(hostElementId)! as T;

      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );

      this.element = importedNode.firstElementChild as U; // section
      if (newElementId) {
        this.element.id = newElementId; // active-projects or inactive-projects
      }

      this.attach(insertAtStart);
    }

    // Rendering the form element or list
    private attach(insertAtBeginning: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtBeginning ? "afterbegin" : "beforeend",
        this.element
      ); // attach before the end of div
    }

    abstract configure(): void;
    abstract renderContent(): void;
  }
}
