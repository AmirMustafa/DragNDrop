// Project Input form handled
namespace App {
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
      super("project-input", "app", true, "user-input");

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
    }

    configure() {
      this.element.addEventListener("submit", this.submitHandler);
    }

    renderContent() {}

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
  }
}
