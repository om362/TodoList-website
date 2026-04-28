
        // Sample tasks data
        let tasks = [
            {
                id: 1,
                title: "Complete project report",
                description: "Finish the quarterly report and submit to manager by Friday",
                category: "work",
                priority: "high",
                dueDate: "2023-12-15",
                tags: ["urgent", "project", "report"],
                completed: false,
                createdAt: "2023-12-10"
            },
            {
                id: 2,
                title: "Buy groceries",
                description: "Milk, eggs, bread, fruits, and vegetables",
                category: "personal",
                priority: "medium",
                dueDate: "2023-12-12",
                tags: ["shopping", "home"],
                completed: false,
                createdAt: "2023-12-11"
            },
            {
                id: 3,
                title: "Morning exercise",
                description: "30 minutes of cardio and 15 minutes of stretching",
                category: "health",
                priority: "medium",
                dueDate: "2023-12-12",
                tags: ["fitness", "routine"],
                completed: true,
                createdAt: "2023-12-11"
            },
            {
                id: 4,
                title: "Read programming book",
                description: "Read chapter 5 of 'Clean Code'",
                category: "learning",
                priority: "low",
                dueDate: "2023-12-18",
                tags: ["reading", "programming"],
                completed: false,
                createdAt: "2023-12-10"
            },
            {
                id: 5,
                title: "Team meeting",
                description: "Weekly team sync to discuss project progress",
                category: "work",
                priority: "high",
                dueDate: "2023-12-13",
                tags: ["meeting", "team"],
                completed: false,
                createdAt: "2023-12-09"
            },
            {
                id: 6,
                title: "Plan weekend trip",
                description: "Research destinations and book accommodations",
                category: "personal",
                priority: "low",
                dueDate: "2023-12-14",
                tags: ["travel", "weekend"],
                completed: false,
                createdAt: "2023-12-08"
            }
        ];

        // DOM Elements
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        const addTaskForm = document.getElementById('addTaskForm');
        const addFirstTaskBtn = document.getElementById('addFirstTask');
        const clearFiltersBtn = document.getElementById('clearFilters');
        
        // Filter elements
        const filterCategory = document.getElementById('filterCategory');
        const filterPriority = document.getElementById('filterPriority');
        const filterStatus = document.getElementById('filterStatus');

        // Current filters
        let currentFilters = {
            category: 'all',
            priority: 'all',
            status: 'all'
        };

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            renderTasks();
            setupEventListeners();
        });

        // Render tasks based on current filters
        function renderTasks() {
            tasksList.innerHTML = '';
            
            // Filter tasks
            let filteredTasks = tasks.filter(task => {
                // Category filter
                if (currentFilters.category !== 'all' && task.category !== currentFilters.category) {
                    return false;
                }
                
                // Priority filter
                if (currentFilters.priority !== 'all' && task.priority !== currentFilters.priority) {
                    return false;
                }
                
                // Status filter
                if (currentFilters.status !== 'all') {
                    if (currentFilters.status === 'pending' && task.completed) return false;
                    if (currentFilters.status === 'completed' && !task.completed) return false;
                }
                
                return true;
            });
            
            // Check if there are no tasks
            if (filteredTasks.length === 0) {
                emptyState.style.display = 'block';
                return;
            } else {
                emptyState.style.display = 'none';
            }
            
            // Sort tasks: incomplete first, then by priority, then by due date
            filteredTasks.sort((a, b) => {
                // Incomplete tasks first
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                
                // Priority: high > medium > low
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                }
                
                // Due date: earlier dates first
                if (a.dueDate && b.dueDate) {
                    return new Date(a.dueDate) - new Date(b.dueDate);
                }
                
                return 0;
            });
            
            // Render each task
            filteredTasks.forEach(task => {
                const taskCard = createTaskCard(task);
                tasksList.appendChild(taskCard);
            });
        }

        // Create a task card element
        function createTaskCard(task) {
            const taskCard = document.createElement('div');
            taskCard.className = `task-card ${task.priority}-priority ${task.completed ? 'completed' : ''}`;
            taskCard.dataset.id = task.id;
            
            // Format due date
            let dueDateText = 'No due date';
            if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                const today = new Date();
                const tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);
                
                if (dueDate.toDateString() === today.toDateString()) {
                    dueDateText = 'Today';
                } else if (dueDate.toDateString() === tomorrow.toDateString()) {
                    dueDateText = 'Tomorrow';
                } else {
                    dueDateText = dueDate.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                    });
                }
            }
            
            // Create tags HTML
            let tagsHTML = '';
            if (task.tags && task.tags.length > 0) {
                tagsHTML = task.tags.map(tag => 
                    `<span class="task-tag">${tag}</span>`
                ).join('');
            }
            
            taskCard.innerHTML = `
                <div class="task-header">
                    <div class="task-title">
                        <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}">
                            ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                        </div>
                        <div class="task-name ${task.completed ? 'completed' : ''}">
                            ${task.title}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="task-action-btn edit-task" data-id="${task.id}" title="Edit task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action-btn delete-task" data-id="${task.id}" title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="task-body">
                    ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                    ${tagsHTML ? `<div class="task-tags">${tagsHTML}</div>` : ''}
                </div>
                
                <div class="task-footer">
                    <div class="task-meta">
                        <div class="task-meta-item">
                            <i class="fas fa-folder"></i>
                            <span class="task-category">${task.category.charAt(0).toUpperCase() + task.category.slice(1)}</span>
                        </div>
                        <div class="task-meta-item">
                            <i class="fas fa-flag"></i>
                            <span class="task-priority priority-${task.priority}">
                                ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                            </span>
                        </div>
                        <div class="task-meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${dueDateText}</span>
                        </div>
                    </div>
                    
                    <div class="task-status">
                        ${task.completed ? 
                            '<span style="color: var(--success); font-weight: 500;"><i class="fas fa-check-circle"></i> Completed</span>' : 
                            '<span style="color: var(--warning); font-weight: 500;"><i class="fas fa-clock"></i> Pending</span>'
                        }
                    </div>
                </div>
            `;
            
            return taskCard;
        }

        // Add a new task
        function addTask(taskData) {
            const newTask = {
                id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
                title: taskData.title,
                description: taskData.description || '',
                category: taskData.category || 'personal',
                priority: taskData.priority || 'medium',
                dueDate: taskData.dueDate || '',
                tags: taskData.tags ? taskData.tags.split(',').map(tag => tag.trim()) : [],
                completed: false,
                createdAt: new Date().toISOString().split('T')[0]
            };
            
            tasks.push(newTask);
            renderTasks();
            
            // Reset form
            addTaskForm.reset();
            
            // Show success message
            showNotification(`Task "${newTask.title}" added successfully!`, 'success');
        }

        // Toggle task completion
        function toggleTaskCompletion(taskId) {
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
                renderTasks();
                
                const task = tasks[taskIndex];
                const status = task.completed ? 'completed' : 'pending';
                showNotification(`Task marked as ${status}`, 'success');
            }
        }

        // Delete a task
        function deleteTask(taskId) {
            if (confirm('Are you sure you want to delete this task?')) {
                const taskIndex = tasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    const taskTitle = tasks[taskIndex].title;
                    tasks.splice(taskIndex, 1);
                    renderTasks();
                    showNotification(`Task "${taskTitle}" deleted`, 'success');
                }
            }
        }

        // Edit a task (simplified version)
        function editTask(taskId) {
            const task = tasks.find(task => task.id === taskId);
            if (task) {
                // Fill the form with task data
                document.getElementById('taskTitle').value = task.title;
                document.getElementById('taskDescription').value = task.description || '';
                document.getElementById('taskCategory').value = task.category;
                document.getElementById('taskPriority').value = task.priority;
                document.getElementById('taskDueDate').value = task.dueDate || '';
                document.getElementById('taskTags').value = task.tags ? task.tags.join(', ') : '';
                
                // Remove the task (will be re-added with updated data)
                const taskIndex = tasks.findIndex(t => t.id === taskId);
                tasks.splice(taskIndex, 1);
                
                // Change form button text
                const submitBtn = addTaskForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Task';
                
                // Scroll to form
                document.querySelector('.add-task-section').scrollIntoView({ behavior: 'smooth' });
                
                showNotification('Edit the task details below', 'info');
            }
        }

        // Show notification
        function showNotification(message, type = 'info') {
            // Remove existing notification
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            // Create notification
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                    <span>${message}</span>
                </div>
                <button class="notification-close">&times;</button>
            `;
            
            // Add styles for notification
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)'};
                color: white;
                padding: 15px 20px;
                border-radius: var(--border-radius);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            
            // Add animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `;
            document.head.appendChild(style);
            
            // Add close button event
            notification.querySelector('.notification-close').addEventListener('click', function() {
                notification.remove();
            });
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 5000);
            
            document.body.appendChild(notification);
        }

        // Setup event listeners
        function setupEventListeners() {
            // Add task form submission
            addTaskForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const taskData = {
                    title: document.getElementById('taskTitle').value.trim(),
                    description: document.getElementById('taskDescription').value.trim(),
                    category: document.getElementById('taskCategory').value,
                    priority: document.getElementById('taskPriority').value,
                    dueDate: document.getElementById('taskDueDate').value,
                    tags: document.getElementById('taskTags').value.trim()
                };
                
                if (!taskData.title) {
                    showNotification('Please enter a task title', 'error');
                    return;
                }
                
                addTask(taskData);
                
                // Reset button text if it was changed for editing
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Task';
            });
            
            // Add first task button
            addFirstTaskBtn.addEventListener('click', function() {
                document.querySelector('.add-task-section').scrollIntoView({ behavior: 'smooth' });
                document.getElementById('taskTitle').focus();
            });
            
            // Clear filters button
            clearFiltersBtn.addEventListener('click', function() {
                filterCategory.value = 'all';
                filterPriority.value = 'all';
                filterStatus.value = 'all';
                
                currentFilters = {
                    category: 'all',
                    priority: 'all',
                    status: 'all'
                };
                
                renderTasks();
                showNotification('Filters cleared', 'success');
            });
            
            // Filter change events
            filterCategory.addEventListener('change', function() {
                currentFilters.category = this.value;
                renderTasks();
            });
            
            filterPriority.addEventListener('change', function() {
                currentFilters.priority = this.value;
                renderTasks();
            });
            
            filterStatus.addEventListener('change', function() {
                currentFilters.status = this.value;
                renderTasks();
            });
            
            // Event delegation for task actions
            tasksList.addEventListener('click', function(e) {
                const target = e.target;
                const taskId = parseInt(target.closest('[data-id]')?.dataset.id);
                
                if (!taskId) return;
                
                // Checkbox click
                if (target.classList.contains('task-checkbox') || target.closest('.task-checkbox')) {
                    toggleTaskCompletion(taskId);
                }
                
                // Edit button click
                if (target.classList.contains('edit-task') || target.closest('.edit-task')) {
                    editTask(taskId);
                }
                
                // Delete button click
                if (target.classList.contains('delete-task') || target.closest('.delete-task')) {
                    deleteTask(taskId);
                }
            });
        }
    