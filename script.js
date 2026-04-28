
        // Sample task data
        const tasks = [
            { id: 1, title: "Complete project report", category: "work", priority: "high", time: 2, completed: false },
            { id: 2, title: "Prepare presentation for meeting", category: "work", priority: "high", time: 1.5, completed: false },
            { id: 3, title: "Morning exercise", category: "health", priority: "medium", time: 1, completed: true },
            { id: 4, title: "Read 30 pages of book", category: "learning", priority: "low", time: 1, completed: false },
            { id: 5, title: "Plan weekend activities", category: "personal", priority: "low", time: 0.5, completed: false },
            { id: 6, title: "Review quarterly goals", category: "work", priority: "medium", time: 1, completed: false },
            { id: 7, title: "Update portfolio website", category: "work", priority: "medium", time: 2, completed: false },
            { id: 8, title: "Call family", category: "personal", priority: "medium", time: 0.5, completed: true }
        ];

        // DOM Elements
        const taskList = document.getElementById('taskList');
        const taskForm = document.getElementById('taskForm');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const todayTasksElement = document.getElementById('todayTasks');
        const completedTasksElement = document.getElementById('completedTasks');
        const focusTimeElement = document.getElementById('focusTime');
        const productivityScoreElement = document.getElementById('productivityScore');
        const progressChart = document.getElementById('progressChart');
        const timerDisplay = document.getElementById('timerDisplay');
        const startTimerBtn = document.getElementById('startTimer');
        const pauseTimerBtn = document.getElementById('pauseTimer');
        const resetTimerBtn = document.getElementById('resetTimer');
        const timerModeButtons = document.querySelectorAll('.timer-mode');

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            renderTasks();
            updateStats();
            renderProgressChart();
            setupTimer();
            setupEventListeners();
        });

        // Render tasks to the DOM
        function renderTasks(filter = 'all') {
            taskList.innerHTML = '';
            
            const filteredTasks = filter === 'all' 
                ? tasks 
                : tasks.filter(task => task.priority === filter);
            
            filteredTasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = `task-item ${task.priority}-priority`;
                
                const checked = task.completed ? 'checked' : '';
                
                taskItem.innerHTML = `
                    <div class="task-checkbox">
                        <input type="checkbox" id="task-${task.id}" ${checked} data-id="${task.id}">
                    </div>
                    <div class="task-content">
                        <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
                        <div class="task-meta">
                            <span class="task-category">${task.category}</span>
                            <span><i class="far fa-clock"></i> ${task.time} hrs</span>
                            <span class="priority-badge">${task.priority} priority</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="task-action-btn" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                        <button class="task-action-btn" data-id="${task.id}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                taskList.appendChild(taskItem);
                
                // Add event listener to checkbox
                const checkbox = taskItem.querySelector(`#task-${task.id}`);
                checkbox.addEventListener('change', function() {
                    const taskId = parseInt(this.getAttribute('data-id'));
                    toggleTaskCompletion(taskId);
                });
                
                // Add event listeners to action buttons
                const actionButtons = taskItem.querySelectorAll('.task-action-btn');
                actionButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const taskId = parseInt(this.getAttribute('data-id'));
                        if (this.querySelector('.fa-trash')) {
                            deleteTask(taskId);
                        } else if (this.querySelector('.fa-edit')) {
                            editTask(taskId);
                        }
                    });
                });
            });
        }

        // Update dashboard statistics
        function updateStats() {
            const todayTasks = tasks.filter(task => !task.completed).length;
            const completedTasks = tasks.filter(task => task.completed).length;
            
            // Calculate focus time (sum of all task times * 0.7 for completed tasks)
            const focusTime = tasks.reduce((total, task) => {
                return total + (task.completed ? task.time * 0.7 : 0);
            }, 3.5); // Start with base time
            
            // Calculate productivity score
            const totalTasks = tasks.length;
            const completedPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            const productivityScore = Math.min(100, completedPercentage + 15); // Add some buffer
            
            todayTasksElement.textContent = todayTasks;
            completedTasksElement.textContent = completedTasks;
            focusTimeElement.textContent = focusTime.toFixed(1);
            productivityScoreElement.textContent = `${productivityScore}%`;
        }

        // Render progress chart
        function renderProgressChart() {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const productivityData = [65, 70, 85, 90, 87, 60, 40]; // Sample data
            
            progressChart.innerHTML = '';
            
            days.forEach((day, index) => {
                const barHeight = productivityData[index];
                const bar = document.createElement('div');
                bar.className = 'chart-bar';
                bar.style.height = `${barHeight}%`;
                bar.innerHTML = `<div class="chart-label">${day}</div>`;
                progressChart.appendChild(bar);
                
                // Add tooltip on hover
                bar.addEventListener('mouseover', function() {
                    this.setAttribute('title', `${productivityData[index]}% productivity`);
                });
            });
        }

        // Pomodoro Timer functionality
        function setupTimer() {
            let timerInterval;
            let timeLeft = 25 * 60; // 25 minutes in seconds
            let isRunning = false;
            let currentMode = 'pomodoro';
            
            // Update timer display
            function updateDisplay() {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            // Start the timer
            function startTimer() {
                if (isRunning) return;
                
                isRunning = true;
                timerInterval = setInterval(() => {
                    timeLeft--;
                    updateDisplay();
                    
                    if (timeLeft <= 0) {
                        clearInterval(timerInterval);
                        isRunning = false;
                        alert('Time is up! Take a break.');
                    }
                }, 1000);
            }
            
            // Pause the timer
            function pauseTimer() {
                clearInterval(timerInterval);
                isRunning = false;
            }
            
            // Reset the timer
            function resetTimer() {
                clearInterval(timerInterval);
                isRunning = false;
                
                // Reset to current mode's time
                switch(currentMode) {
                    case 'pomodoro':
                        timeLeft = 25 * 60;
                        break;
                    case 'short':
                        timeLeft = 5 * 60;
                        break;
                    case 'long':
                        timeLeft = 15 * 60;
                        break;
                }
                
                updateDisplay();
            }
            
            // Switch timer mode
            function switchTimerMode(minutes, mode) {
                currentMode = mode;
                timeLeft = minutes * 60;
                updateDisplay();
                
                // Update active button
                timerModeButtons.forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');
                
                // If timer is running, restart with new time
                if (isRunning) {
                    pauseTimer();
                    startTimer();
                }
            }
            
            // Event listeners for timer controls
            startTimerBtn.addEventListener('click', startTimer);
            pauseTimerBtn.addEventListener('click', pauseTimer);
            resetTimerBtn.addEventListener('click', resetTimer);
            
            // Event listeners for timer modes
            timerModeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const minutes = parseInt(this.getAttribute('data-time'));
                    const mode = this.textContent.includes('Short') ? 'short' : 
                                 this.textContent.includes('Long') ? 'long' : 'pomodoro';
                    switchTimerMode(minutes, mode);
                });
            });
            
            // Initialize display
            updateDisplay();
        }

        // Setup event listeners
        function setupEventListeners() {
            // Filter buttons
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Get filter value and render tasks
                    const filter = this.getAttribute('data-filter');
                    renderTasks(filter);
                });
            });
            
            // Task form submission
            taskForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const title = document.getElementById('taskTitle').value;
                const category = document.getElementById('taskCategory').value;
                const priority = document.getElementById('taskPriority').value;
                const time = parseFloat(document.getElementById('taskTime').value);
                
                // Create new task
                const newTask = {
                    id: tasks.length + 1,
                    title: title,
                    category: category,
                    priority: priority,
                    time: time,
                    completed: false
                };
                
                // Add to tasks array
                tasks.push(newTask);
                
                // Re-render tasks and update stats
                renderTasks();
                updateStats();
                
                // Reset form
                taskForm.reset();
                document.getElementById('taskTime').value = 1;
                
                // Show confirmation
                alert('Task added successfully!');
            });
        }

        // Toggle task completion
        function toggleTaskCompletion(taskId) {
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
                updateStats();
                
                // Re-render tasks if a filter is active
                const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                if (activeFilter !== 'all') {
                    renderTasks(activeFilter);
                }
            }
        }

        // Delete a task
        function deleteTask(taskId) {
            if (confirm('Are you sure you want to delete this task?')) {
                const taskIndex = tasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    tasks.splice(taskIndex, 1);
                    
                    // Re-render tasks and update stats
                    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                    renderTasks(activeFilter);
                    updateStats();
                }
            }
        }

        // Edit a task (simplified - in a real app this would open a form)
        function editTask(taskId) {
            const task = tasks.find(task => task.id === taskId);
            if (task) {
                document.getElementById('taskTitle').value = task.title;
                document.getElementById('taskCategory').value = task.category;
                document.getElementById('taskPriority').value = task.priority;
                document.getElementById('taskTime').value = task.time;
                
                // Remove the task since we're editing it
                deleteTask(taskId);
                
                // Scroll to the form
                document.getElementById('taskTitle').focus();
            }
        }
    