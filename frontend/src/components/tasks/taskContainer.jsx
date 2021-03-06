import _ from 'lodash';
import React from 'react';
import {DropTarget} from 'react-dnd';
import Task from './task.jsx';
import {TaskContainerActions} from '../../actions/actions.js';

const target = {
  hover(props, monitor) {
    let drag = {
      taskId: monitor.getItem().id,
      tasks: props.tasks
    };
    if (monitor.isOver({shallow: true})) {
      TaskContainerActions.addTaskToContainerLocally(drag);
    }
  },

  drop(props, monitor) {
    TaskContainerActions.updateTaskOnServer(monitor.getItem().id);
  }
};

let collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

let TaskContainer = React.createClass({
  propTypes: {
    users: React.PropTypes.array.isRequired,
    tasks: React.PropTypes.array.isRequired
  },

  render() {
    let tasks = this.props.tasks.map((task) => {
      let user = _.findWhere(this.props.users, {id: task.userId});
      return (<Task key={task.id} id={task.id} name={task.name} description={task.description} score={task.score} user={user} />);
    });

    const {connectDropTarget} = this.props;
    return connectDropTarget(
      this.props.tasks.length ?
      (<div className='task-container'>{tasks}</div>) :
      (<div className='task-container task-container-no-tasks'><span className='task-container-no-tasks-message'>{this.props.empty}</span></div>)
    );
  }

});

export default DropTarget('task', target, collect)(TaskContainer);
