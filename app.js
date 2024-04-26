document.addEventListener("DOMContentLoaded", () => {
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  const startListeningButton = document.querySelector(".record");
  const tasksList = document.querySelector(".tasks");

  let tasks = [];

  let recognizing = false;

  recognition.continuous = true;
  recognition.lang = "es";

  startListeningButton.addEventListener("click", toggleSpeechRecognition);

  function toggleSpeechRecognition() {
    // Cambiar el estado de reconocimiento
    recognizing = !recognizing;

    // Actualizar la interfaz de usuario
    if (recognizing) {
      startListeningButton.innerHTML = '<i class="bx bx-loader bx-spin"></i>';
      startListeningButton.classList.add("recording");
      recognition.start();
    } else {
      startListeningButton.innerHTML = '<i class="bx bx-microphone"></i>';
      startListeningButton.classList.remove("recording");
      recognition.stop();
    }
  }

  recognition.onresult = (event) => {
    const taskText = event.results[event.results.length - 1][0].transcript;
    addTask(taskText);
  };

  function addTask(taskText) {
    const task = {
      id: Date.now().toString(),
      text: taskText.charAt(0).toUpperCase() + taskText.slice(1) + ".",
      done: false,
    };
    tasks.unshift(task);
    renderTasks();
    saveTasksToLocalStorage();
  }

  function renderTasks() {
    tasksList.innerHTML = "";

    tasks.forEach((task) => {
      const { id, done, text } = task;

      const taskElement = document.createElement("li");

      taskElement.innerHTML = `
              <input type="checkbox" id="${id}" ${done ? "checked" : ""}>
              <label for="${id}" ${
        done ? 'style="text-decoration: line-through;"' : ""
      }>${text}</label>
              <button class="delete-task" data-id="${id}">
                  <i class='bx bx-trash'></i>
              </button>
          `;

      tasksList.appendChild(taskElement);

      const checkbox = taskElement.querySelector('input[type="checkbox"]');
      checkbox.addEventListener("change", () => toggleTaskDone(id));

      const deleteButton = taskElement.querySelector(".delete-task");
      deleteButton.addEventListener("click", () => deleteTask(id));
    });
  }

  function toggleTaskDone(taskId) {
    tasks = tasks.map((task) => {
      if (task.id === taskId) {
        task.done = !task.done;
      }
      return task;
    });
    renderTasks();
    saveTasksToLocalStorage();
  }

  function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    renderTasks();
    saveTasksToLocalStorage();
  }

  function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromLocalStorage() {
    const tasksFromStorage = localStorage.getItem("tasks");
    if (tasksFromStorage) {
      tasks = JSON.parse(tasksFromStorage);
      renderTasks();
    }
  }

  loadTasksFromLocalStorage();
});
