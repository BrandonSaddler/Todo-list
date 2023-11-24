    // Load tasks from localStorage
    document.addEventListener("DOMContentLoaded", () => {
      const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      renderTasks(savedTasks);
    });

    function allowDrop(event) {
      event.preventDefault();
    }

    function drag(event) {
      event.dataTransfer.setData("text", event.target.id);
    }

    function drop(event) {
      event.preventDefault();
      const taskId = event.dataTransfer.getData("text");
      const draggedElement = document.getElementById(taskId);

      const taskList = document.getElementById("taskList");
      const targetElement = event.target.closest(".task-item");

      // Reorder tasks
      taskList.insertBefore(draggedElement, targetElement.nextSibling);

      // Update the tasks array and save to localStorage
      updateTasks();
    }

    function addTask() {
      const taskInput = document.getElementById("taskInput");
      const taskList = document.getElementById("taskList");

      if (taskInput.value.trim() !== "") {
        const div = document.createElement("div");
        div.id = "task-" + Date.now();
        div.className = "task-item";
        div.draggable = true;

        const priority = document.querySelector('input[name="priority"]:checked').value;

        div.innerHTML = `
          <span class="priority-${priority.toLowerCase()}">${priority}</span> 
          ${taskInput.value}
          <span class="delete" onclick="removeTask('${div.id}')">Delete</span>
        `;

        taskList.appendChild(div);
        taskInput.value = "";

        // Update the tasks array and save to localStorage
        updateTasks();
      }
    }

    function removeTask(taskId) {
      const taskList = document.getElementById("taskList");
      const div = document.getElementById(taskId);
      taskList.removeChild(div);

      // Update the tasks array and save to localStorage
      updateTasks();
    }

    function updateTasks() {
      const taskList = document.getElementById("taskList");
      const tasks = Array.from(taskList.children).map((div) => ({
        id: div.id,
        priority: div.querySelector("span").textContent,
        text: div.textContent.trim().replace(/Delete/, ''),
        completed: div.classList.contains("completed"),
      }));

      // Save tasks to localStorage
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks(tasks) {
      const taskList = document.getElementById("taskList");

      tasks.forEach((task) => {
        const div = document.createElement("div");
        div.id = task.id;
        div.className = "task-item";
        div.draggable = true;

        div.innerHTML = `
          <span class="priority-${task.priority.toLowerCase()}">${task.priority}</span> 
          ${task.text}
          <span class="delete" onclick="removeTask('${div.id}')">Delete</span>
        `;

        if (task.completed) {
          div.classList.add("completed");
        }

        taskList.appendChild(div);
      });
    }