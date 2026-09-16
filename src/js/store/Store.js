import { BehaviorSubject } from 'rxjs';

export default class Store {
  constructor(initialState) {
    this.subject = new BehaviorSubject(initialState);
    this.state$ = this.subject.asObservable();
  }

  get state() {
    return this.subject.getValue();
  }

  toggleTask(projectId, taskId) {
    const updatedProjects = this.state.projects.map((project) => {
      if (project.id === projectId) {
        const updatedTasks = project.tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, done: !task.done };
          }
          return task;
        });
        return { ...project, tasks: updatedTasks };
      }
      return project;
    });

    this.subject.next({ projects: updatedProjects });
  }
}
