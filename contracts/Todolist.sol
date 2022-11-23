// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

contract Todolist {
    uint256 public taskCount = 0;
    
    struct Task {
        uint id;
        string content;
        bool complete;
    }
    
    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool complete
    );

    event TaskCompleted(
        uint id,
        bool complete
    );

    //constructor
    constructor() public{
        createTask("List Down Your First Task");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount,_content,false);
        emit TaskCreated(taskCount, _content, false);
    }
    
    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.complete = !_task.complete;
        tasks[_id] = _task;
        emit TaskCompleted(_id,  _task.complete);
    }
}
