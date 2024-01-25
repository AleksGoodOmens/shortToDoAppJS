const createTaskManager = require('./taskManager');

describe('createTaskManager', () => {
	const taskManager = createTaskManager();
	taskManager.init();

	test('return object', () => {
		expect(typeof taskManager).toBe('object');
	});
});

describe('check for valid methods', () => {
	const taskManager = createTaskManager();
	test('have method addTask', () => {
		expect(taskManager).toHaveProperty('addTask');
	});
	test('have method undo', () => {
		expect(taskManager).toHaveProperty('undo');
	});
	test('have method redo', () => {
		expect(taskManager).toHaveProperty('redo');
	});
	test('have method viewTasks', () => {
		expect(taskManager).toHaveProperty('viewTasks');
	});
});

//! add task
describe('method addTask added new task to taskManager', () => {
	const taskManager = createTaskManager();
	taskManager.init();

	test('taskManager.addTask() => add new task to taskManager active tasks', () => {
		const input = {
			title: 'task one',
			completed: false,
		};

		taskManager.addTask(input);

		expect(taskManager.allTasks).toEqual([
			{ id: 0, title: 'task one', completed: false },
		]);
	});
});

//! complete task
describe('method completeTask change value of task complete to true', () => {
	const taskManager = createTaskManager();
	taskManager.init();

	test('taskManager.complete task() => add new task to taskManager active tasks', () => {
		const input = {
			title: 'task one',
			completed: false,
		};
		const input2 = {
			title: 'task two',
			completed: false,
		};

		taskManager.addTask(input);
		taskManager.addTask(input2);

		expect(taskManager.allTasks).toEqual([
			{ title: 'task one', completed: false, id: 0 },
			{ title: 'task two', completed: false, id: 1 },
		]);

		taskManager.completeTask(0);

		expect(taskManager.activeTasks).toEqual([
			{ title: 'task two', completed: false, id: 1 },
		]);
		expect(taskManager.completedTasks).toEqual([
			{ title: 'task one', completed: true, id: 0, isOld: true },
		]);
	});
});

//!undo
describe('method undo return last completed task back to active', () => {
	const taskManager = createTaskManager();
	taskManager.init();

	const input = {
		title: 'task one',
		completed: false,
	};
	const input2 = {
		title: 'task two',
		completed: false,
	};
	taskManager.addTask(input);
	taskManager.addTask(input2);

	test('should first console message if no tasks are completed', () => {
		expect(taskManager.undo()).toBe('no completed tasks yet');
	});

	test('should second return last added task back to active and delete it from completed', () => {
		taskManager.completeTask(1);
		taskManager.undo();
		expect(taskManager.completedTasks).toEqual([]);
		expect(taskManager.activeTasks).toEqual([
			{
				id: 0,
				title: 'task one',
				completed: false,
			},
			{
				id: 1,
				title: 'task two',
				completed: false,
				isOld: true,
			},
		]);
	});
});

//!redo()
describe('method redo return last active task back to completed', () => {
	const taskManager = createTaskManager();
	taskManager.init();

	const input = {
		title: 'task one',
		completed: false,
	};
	const input2 = {
		title: 'task two',
		completed: false,
	};

	test('should first console message if no tasks are in active list', () => {
		expect(taskManager.redo()).toBe('no active tasks yet');
	});

	test('should second return last added task back to completed and delete it from active', () => {
		taskManager.addTask(input);
		taskManager.addTask(input2);
		taskManager.completeTask(0);
		taskManager.undo();
		taskManager.redo();

		expect(taskManager.completedTasks).toEqual([
			{
				id: 0,
				title: 'task one',
				completed: true,
				isOld: true,
			},
		]);
		expect(taskManager.activeTasks).toEqual([
			{
				id: 1,
				title: 'task two',
				completed: false,
			},
		]);
	});
});

//! Full test
describe('full test', () => {
	const taskManager = createTaskManager();
	taskManager.init();

	const input = {
		title: 'task one',
		completed: false,
	};
	const input2 = {
		title: 'task two',
		completed: false,
	};
	const input3 = {
		title: 'task 3',
		completed: false,
	};
	const input4 = {
		title: 'task 4',
		completed: false,
	};
	const input5 = {
		title: 'task 5',
		completed: false,
	};
	const input6 = {
		title: 'task 6',
		completed: false,
	};
	taskManager.addTask(input);
	taskManager.addTask(input2);
	taskManager.addTask(input3);
	taskManager.addTask(input4);
	taskManager.addTask(input5);
	taskManager.addTask(input6);

	test('should first allTasks length = 6', () => {
		expect(taskManager.viewTasks().length).toEqual(6);
	});
	test('should return correct id starting from 0', () => {
		expect(taskManager.completeTask(3)).toEqual({
			title: 'task 4',
			completed: true,
			isOld: true,
			id: 3,
		});
	});
	test('should return correct list, allTasks , activeTasks completedTasks', () => {
		expect(taskManager.completedTasks.length).toBe(1);
		expect(taskManager.activeTasks.length).toBe(5);
		expect(taskManager.allTasks.length).toBe(6);
	});
	test('should return correct list, allTasks , activeTasks completedTasks after undo()', () => {
		taskManager.undo();

		expect(taskManager.completedTasks.length).toBe(0);
		expect(taskManager.activeTasks.length).toBe(6);
		expect(taskManager.allTasks.length).toBe(6);
	});
	test('should return correct list, allTasks , activeTasks completedTasks after redo()', () => {
		taskManager.redo();
		expect(taskManager.completedTasks.length).toBe(1);
		expect(taskManager.activeTasks.length).toBe(5);
		expect(taskManager.allTasks.length).toBe(6);
	});
});
