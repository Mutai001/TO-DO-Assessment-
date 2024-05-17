document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('#add-task input');
    const todoList = document.querySelector('.dot-list');
    const leftItems = document.querySelector('.left-items');
    const filters = document.querySelectorAll('.list-2 ul li');
    const clearCompleted = document.querySelector('.completed');

    function updateLeftItemsCount() {
        const itemsLeft = document.querySelectorAll('.dot-list li:not(.completed)').length;
        leftItems.textContent = `${itemsLeft} items left`;
    }

    function filterTasks(filter) {
        const tasks = document.querySelectorAll('.dot-list li');
        tasks.forEach(task => {
            switch (filter) {
                case 'All':
                    task.style.display = 'flex';
                    break;
                case 'Active':
                    task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
                    break;
                case 'Completed':
                    task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                    break;
            }
        });
    }

    function addTask(taskText) {
        const li = document.createElement('li');
        li.innerHTML = `<span class="task">${taskText}</span> <button class="delete-btn">X</button>`;
        li.draggable = true;

        li.addEventListener('click', () => {
            li.classList.toggle('completed');
            updateLeftItemsCount();
        });

        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            li.remove();
            updateLeftItemsCount();
        });

        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', li.innerHTML);
            e.dataTransfer.effectAllowed = 'move';
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        li.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedHTML = e.dataTransfer.getData('text/plain');
            const droppedHTML = li.innerHTML;
            li.innerHTML = draggedHTML;
            e.dataTransfer.clearData();
            const droppedElement = document.querySelector('.dragging');
            droppedElement.innerHTML = droppedHTML;
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
        });

        li.addEventListener('dragstart', () => {
            li.classList.add('dragging');
        });

        todoList.appendChild(li);
        updateLeftItemsCount();
    }

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== '') {
            addTask(input.value.trim());
            input.value = '';
        }
    });

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('selected'));
            filter.classList.add('selected');
            filterTasks(filter.textContent);
        });
    });

    clearCompleted.addEventListener('click', () => {
        const completedTasks = document.querySelectorAll('.dot-list li.completed');
        completedTasks.forEach(task => task.remove());
        updateLeftItemsCount();
    });

    updateLeftItemsCount();
});