const taskListElement = document.getElementById('task-list');
const inputForm = document.getElementById('form-input-task');
const inputField = document.getElementById('input-task');

class App {
  #taskList;

  constructor() {
    this.#taskList = JSON.parse(localStorage.getItem('tasks')) || [];
    this.#renderTasks(this.#taskList);
    inputForm.addEventListener('submit', this.#insertTask.bind(this));
    taskListElement.addEventListener('click', this.#handleTaskClick.bind(this));
  }

  #updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.#taskList));
  }

  #renderTask(text, isCompleted = false) {
    if (!text) return;
    const markup = `
      <li>
        <label>
            <input type="checkbox" class="checkbox-task-done" ${isCompleted
        ? 'checked'
        : ''}>
        </label>
        <span class="task ${isCompleted ? 'completed' : ''}">${text}</span>
        <button class="delete-btn">x</button>
      </li>
  `;
    taskListElement.insertAdjacentHTML('beforeend', markup);
  }

  #renderTasks(tasks) {
    tasks.forEach(task => this.#renderTask(task.text, task.isCompleted));
  }

  #addTaskToTaskList(text, isCompleted = false) {
    this.#taskList.push({text, isCompleted});
    this.#updateLocalStorage();
  }

  #removeTaskFromTaskList(text, isCompleted) {
    this.#taskList = this.#taskList.filter(
        task => task.text !== text || task.isCompleted !== isCompleted);
    this.#updateLocalStorage();
  }

  #changeTaskFromTaskList(text, isCompleted) {
    this.#taskList.find(task => task.text === text && task.isCompleted ===
        isCompleted).isCompleted = !isCompleted;
    this.#updateLocalStorage();
  }

  #insertTask(e) {
    e.preventDefault();
    const taskText = inputField.value;
    if (!taskText) return;
    this.#renderTask(taskText);
    this.#addTaskToTaskList(taskText);
    inputField.value = '';
  }

  #deleteTask(e) {
    if (!e.target.classList.contains('delete-btn')) return;
    const taskElement = e.target.closest('li');
    const taskText = taskElement.querySelector('.task').textContent;
    const isTaskCompleted = Boolean(
        taskElement.querySelector('.checkbox-task-done').checked);
    this.#removeTaskFromTaskList(taskText, isTaskCompleted);
    taskElement.remove();
  }

  #handleCheckbox(e) {
    if (!e.target.classList.contains('checkbox-task-done')) return;

    const newIsCompleted = Boolean(e.target.checked);
    const taskElement = e.target.closest('li');
    const taskTextElement = taskElement.querySelector('.task');
    const taskText = taskTextElement.textContent;
    taskTextElement.classList.remove('completed');
    if (newIsCompleted) {
      taskTextElement.classList.add('completed');
    }
    this.#changeTaskFromTaskList(taskText, !newIsCompleted);
  }

  #handleTaskClick(e) {
    if (e.target.classList.contains('delete-btn')) {
      this.#deleteTask(e);
      return;
    }
    if (e.target.classList.contains('checkbox-task-done')) {
      this.#handleCheckbox(e);
    }
  }
}

new App();






