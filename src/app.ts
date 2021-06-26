// Project Type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type Listener = (items: Project[]) => void;

// Project State Management
class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }

  addListeners(listnerFn: Listener) {
    this.listeners.push(listnerFn);
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

    for (const listnerFn of this.listeners) {
      listnerFn(this.projects.slice()); // slice is added to send copy of array
    }
  }
}

// Private Constructor - Sinegleton
const projectState = ProjectState.getInstance();

// Validator
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.min;
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.max;
  }

  return isValid;
}

// AutoBind Decorator - fixes this pointing issue on submitHandler
function AutoBind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  console.log(descriptor);

  const adjustedMethod = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjustedMethod;
}

// Project Input List
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProject: Project[];

  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;

    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.assignedProject = [];

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement; // section
    this.element.id = `${this.type}-projects`; // active-projects or inactive-projects

    projectState.addListeners((projects: Project[]) => {
      this.assignedProject = projects;
      this.renderProjects();
      // console.log("projects ========>", projects);
    });
    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-project-lists`
    )! as HTMLUListElement;

    for (const prjItem of this.assignedProject) {
      const listItem = document.createElement("li");
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-project-lists`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element); // attach before the end of div
  }
}

// Project Input Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;

    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement; // form
    this.element.id = "user-input"; // adding css

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const user = this.gatherUserInput();
    const [title, description, people] = user;
    this.clearInputs();
    console.log(title, description, people);
    projectState.addProject(title, description, people);
  }

  private gatherUserInput(): [string, string, number] {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescriprion = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidatable: Validatable = {
      value: enteredDescriprion,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      const errmsg = "Invalid input, please try again";
      alert(errmsg);
      throw new Error(errmsg);
    } else {
      return [enteredTitle, enteredDescriprion, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  // Rendering the form inside template tag
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projEl = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
