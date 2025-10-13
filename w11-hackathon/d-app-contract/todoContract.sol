    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.19;

    /// @title Decentralized Todo List
    /// @notice Each user can manage their own tasks on-chain
    contract TodoList {
        uint256 private nextTaskId;

        struct Task {
            uint256 id;
            address owner;
            string content;
            bool completed;
            uint256 createdAt;
            uint256 updatedAt;
            bool exists;
        }

        mapping(address => uint256[]) private ownerTaskIds;
        mapping(uint256 => Task) private tasks;

        event TaskCreated(uint256 indexed id, address indexed owner, string content, uint256 timestamp);
        event TaskToggled(uint256 indexed id, address indexed owner, bool completed, uint256 timestamp);
        event TaskEdited(uint256 indexed id, address indexed owner, string newContent, uint256 timestamp);
        event TaskDeleted(uint256 indexed id, address indexed owner, uint256 timestamp);

        constructor() {
            nextTaskId = 1;
        }

        function createTask(string calldata _content) external {
            require(bytes(_content).length > 0, "Content cannot be empty");

            uint256 taskId = nextTaskId++;
            uint256 ts = block.timestamp;

            tasks[taskId] = Task({
                id: taskId,
                owner: msg.sender,
                content: _content,
                completed: false,
                createdAt: ts,
                updatedAt: ts,
                exists: true
            });

            ownerTaskIds[msg.sender].push(taskId);
            emit TaskCreated(taskId, msg.sender, _content, ts);
        }

        function toggleTask(uint256 _id) external {
            Task storage t = tasks[_id];
            require(t.exists, "Task does not exist");
            require(t.owner == msg.sender, "Not task owner");

            t.completed = !t.completed;
            t.updatedAt = block.timestamp;
            emit TaskToggled(_id, msg.sender, t.completed, t.updatedAt);
        }

        function editTask(uint256 _id, string calldata _newContent) external {
            require(bytes(_newContent).length > 0, "Content cannot be empty");
            Task storage t = tasks[_id];
            require(t.exists, "Task does not exist");
            require(t.owner == msg.sender, "Not task owner");

            t.content = _newContent;
            t.updatedAt = block.timestamp;
            emit TaskEdited(_id, msg.sender, _newContent, t.updatedAt);
        }

        function deleteTask(uint256 _id) external {
            Task storage t = tasks[_id];
            require(t.exists, "Task does not exist");
            require(t.owner == msg.sender, "Not task owner");

            t.exists = false;
            t.updatedAt = block.timestamp;
            emit TaskDeleted(_id, msg.sender, t.updatedAt);
        }

        function getTask(uint256 _id) public view returns (
            uint256 id,
            address owner,
            string memory content,
            bool completed,
            uint256 createdAt,
            uint256 updatedAt,
            bool exists
        ) {
            Task storage t = tasks[_id];
            require(t.exists, "Task does not exist");
            return (t.id, t.owner, t.content, t.completed, t.createdAt, t.updatedAt, t.exists);
        }

        function getMyTaskIds() external view returns (uint256[] memory) {
            return ownerTaskIds[msg.sender];
        }

    }
