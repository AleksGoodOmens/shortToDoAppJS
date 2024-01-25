function createTaskManager() {
	const taskManager = Object.create({
		allTasks: [],
		activeTasks: [],
		completedTasks: [],
		lastCompletedTask: [],
		addTask,
		undo,
		redo,
		viewTasks,
		completeTask,
		updateLists,
		init,
	});

	function init() {
		this.allTasks = [];
		this.activeTasks = [];
		this.completedTasks = [];
		this.lastCompletedTask = [];
		this.initialId = 0;
	}

	return taskManager;
}

/**Добавляет новую задачу в менеджер.*/
function addTask(task) {
	this.allTasks.push({ ...task, id: this.initialId++ });
	this.updateLists();
}

/**Отменяет последнюю выполненную задачу и возвращает ее в список доступных задач*/
function undo() {
	if (this.completedTasks.length - 1 >= 0) {
		return this.completeTask(this.lastCompletedTask.pop());
	}

	return 'no completed tasks yet';
}

/**Возвращает отмененную ранее задачу обратно в список выполненных задач. */
function redo() {
	if (this.activeTasks.length - 1 >= 0) {
		if (this.lastCompletedTask.length === 0)
			return 'no previous completed task yet';

		return this.completeTask(this.lastCompletedTask.pop());
	}

	return 'no active tasks yet';
}

/**Возвращает текущий список доступных и выполненных задач.*/
function viewTasks() {
	return this.allTasks;
}

/**Меняет статус задачи с невыполненную на выполненную */
function completeTask(taskId) {
	const currentTask = this.allTasks.find((task) => task.id === taskId);
	this.lastCompletedTask.push(currentTask.id);
	currentTask.completed = !currentTask.completed;
	currentTask.isOld = true;
	this.updateLists();
	return currentTask;
}

/**обновить все листы*/
function updateLists() {
	this.completedTasks = this.allTasks.filter((task) => task.completed === true);
	this.activeTasks = this.allTasks.filter((task) => task.completed === false);
}
module.exports = createTaskManager;
