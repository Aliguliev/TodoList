
let tasks = [];
let complited=0;
if(localStorage.getItem('todo_tasks_clear_num')){
    complited = +JSON.parse(localStorage.getItem('todo_tasks_clear_num'));
    
}

function loadTasks() {
    try {
        const tasksJson = localStorage.getItem('todo_tasks');
        if (tasksJson) {
            tasks = JSON.parse(tasksJson); // ВОТ ЭТОГО НЕ ХВАТАЛО!
            console.log('📂 Загружено задач:', tasks.length);
        } else {
            tasks = [];
            console.log('📂 Нет сохраненных задач');
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        tasks = [];
    }
    tasks = tasks.filter((task)=>{
        if(new Date().setHours(0,0,0,0)>new Date(task.deadline).setHours(0,0,0,0)){
            return false
        }
        return task
        // if(new Date().setHours(0,0,0,0)<=new Date(task.deadline))
    })
    saveTasks()
}


function saveTasks() {
    try {
        localStorage.setItem('todo_tasks', JSON.stringify(tasks));
        console.log('💾 Сохранено задач:', tasks.length);
    } catch (error) {
        console.error('❌ Ошибка сохранения:', error);
    }
    
}


function showModal() {
    document.getElementById('task-modal').classList.add('active');
}
document.querySelector('.quick-add-btn').addEventListener('click', showModal);
function closeModal() {
    document.getElementById('task-modal').classList.remove('active');
    clearModalForm();
}

function showTaskModal(){
    document.getElementById('description-task-modal').classList.add('active');
}
function closeTaskModal() {
    document.getElementById('description-task-modal').classList.remove('active');
    clearModalForm();
}

function clearModalForm() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-project').value = 'work';
    document.getElementById('task-priority').value = 'medium';
    document.getElementById('task-deadline').value = '';
}


function addFullTask() {
    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-description').value.trim();
    const project = document.getElementById('task-project').value;
    const priority = document.getElementById('task-priority').value;
    const deadline = document.getElementById('task-deadline').value;
    
    if (!title) {
        alert('Введите название задачи!');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: title,
        description: description,
        completed: false,
        priority: priority,
        project: project,
        deadline: deadline,
        createdAt: new Date().toISOString(),
        inProccess: false
    };
    
    if(new Date().setHours(0,0,0,0)<=new Date(deadline).setHours(0,0,0,0)){
        tasks.push(newTask);
    }else{
        alert('Время прошло')
    }
    
   
    saveTasks();
    
    closeModal();
    renderTasks();
    alert('✅ Задача "' + title + '" добавлена!');
}


function renderTasks() {
    
    console.log('Текущие задачи:', tasks);
    
    
    updateStats();
    getUpcomingDeadlines(5,tasks)
}


function updateStats() {
    const totalTasks = tasks.length;
    
    
    document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = totalTasks;
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = complited;
}

document.addEventListener('DOMContentLoaded', function() {

    loadTasks();
    renderTasks();

    attachCheckboxHandlers();
});
function setFilter(str,obj){
    //console.log(obj.parentElement.parentElement.parentElement.parentElement.parentElement.classList[1])
    updateTasks(tasks,obj.parentElement.parentElement.parentElement.parentElement.parentElement.classList[1],str)


}
function updateTasks(tasks,condition,...args){
    let res='';
    let res_tasks=[];

    let currentTaskSection;
    let filterDropDown =`<div class="filter-dropdown">
                                        
                    
                    <div class="filter-option" onclick="setFilter('date-asc',this)">
                        <span>📅 По дате (сначала старые)</span>
                    </div>
                    <div class="filter-option" onclick="setFilter('date-desc',this)">
                        <span>📅 По дате (сначала новые)</span>
                    </div>
                    
                    <div class="filter-divider"></div>
                    
                    <div class="filter-option" onclick="setFilter('priority-high',this)">
                        <span>🔴 Сначало важные</span>
                    </div>

                    <div class="filter-option" onclick="setFilter('priority-low',this)">
                        <span>🟢 Сначало неважные</span>
                    </div>                    
                </div>`
    switch (condition){
        case 'dashboard':
            currentTaskSection = document.getElementsByClassName(condition)[0].children[1];
            res=`<div id="filter-div"> 
                    <h3>📅 Ближайшие дедлайны</h3> 
                    <div class="filter-container">
                        <div class="filter-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polygon points="22,3 2,3 10,12.5 10,19 14,21 14,12.5 22,3"></polygon>
                            </svg>
                        </div>
                        ${filterDropDown}
                    </div>
                </div>`;
            res_tasks=tasks;
            break;
        case 'today':
            currentTaskSection = document.getElementsByClassName(condition)[0].children[0];
            res=`<div id="filter-div"> 
                    <h3>Задания на сегодня</h3> 
                    <div class="filter-container">
                        <div class="filter-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polygon points="22,3 2,3 10,12.5 10,19 14,21 14,12.5 22,3"></polygon>
                            </svg>
                        </div>
                        ${filterDropDown}
                    </div>
                </div>`;
            for(let i=0;i<tasks.length;i++){
                const today = new Date().setHours(0,0,0,0);
                const datetasks =new Date(tasks[i].deadline).setHours(0,0,0,0);
                if(datetasks == today){
                    console.log(tasks[i])
                    res_tasks.push(tasks[i]);
                }
            }
            break
            
        case 'future':
            currentTaskSection = document.getElementsByClassName(condition)[0].children[0];
            res=`<div id="filter-div"> 
                    <h3>Будующие задания</h3> 
                    <div class="filter-container">
                        <div class="filter-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polygon points="22,3 2,3 10,12.5 10,19 14,21 14,12.5 22,3"></polygon>
                            </svg>
                        </div>
                        ${filterDropDown}
                    </div>
                </div>`;
            for(let i=0;i<tasks.length;i++){
                const today = new Date().setHours(0,0,0,0);
                const datetasks =new Date(tasks[i].deadline).setHours(0,0,0,0);
                console.log(tasks[i])
                if(datetasks > today){
                    res_tasks.push(tasks[i]);
                }
            }
            break;
        case 'job':
            currentTaskSection = document.getElementsByClassName('project')[0].children[0];
            res=`<div id="filter-div"> 
                    <h3>Работа</h3> 
                    <div class="filter-container">
                        <div class="filter-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polygon points="22,3 2,3 10,12.5 10,19 14,21 14,12.5 22,3"></polygon>
                            </svg>
                        </div>
                        ${filterDropDown}
                    </div>
                </div>`;
            for(let i=0;i<tasks.length;i++){
                console.log(tasks[i].project)
                if(tasks[i].project == 'work'){
                    res_tasks.push(tasks[i]);
                }
            }
            break;
        case 'personal':
            currentTaskSection = document.getElementsByClassName('project')[0].children[0];
            res=`<div id="filter-div"> 
                    <h3>Личное</h3> 
                    <div class="filter-container">
                        <div class="filter-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polygon points="22,3 2,3 10,12.5 10,19 14,21 14,12.5 22,3"></polygon>
                            </svg>
                        </div>
                        ${filterDropDown}
                    </div>
                </div>`;
            for(let i=0;i<tasks.length;i++){
                if(tasks[i].project == 'personal'){
                    res_tasks.push(tasks[i]);
                }
            }
            break;
        case 'buy':
            currentTaskSection = document.getElementsByClassName('project')[0].children[0];
            res=`<div id="filter-div"> 
                    <h3>Покупки</h3> 
                    <div class="filter-container">
                        <div class="filter-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polygon points="22,3 2,3 10,12.5 10,19 14,21 14,12.5 22,3"></polygon>
                            </svg>
                        </div>
                        ${filterDropDown}
                    </div>
                </div>`;
            for(let i=0;i<tasks.length;i++){
                if(tasks[i].project == 'shopping'){
                    res_tasks.push(tasks[i]);
                }
            }
            break;
        case 'study':
            currentTaskSection = document.getElementsByClassName('project')[0].children[0];
            res=`<div id="filter-div"> 
                    <h3>Обучение</h3> 
                    <div class="filter-container">
                        <div class="filter-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polygon points="22,3 2,3 10,12.5 10,19 14,21 14,12.5 22,3"></polygon>
                            </svg>
                        </div>
                        ${filterDropDown}
                    </div>
                </div>`;
            for(let i=0;i<tasks.length;i++){
                if(tasks[i].project == condition){
                    res_tasks.push(tasks[i]);
                }
            }
            break;

    }

    switch (args[0]){
        case 'date-asc':
            res_tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            break;
        case 'date-desc':
            res_tasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
            break;
        case 'priority-high':
            let priorityOrder1 = { "high": 3, "medium": 2, "low": 1 };
            res_tasks.sort((a, b) => priorityOrder1[b.priority] - priorityOrder1[a.priority]);
            break;
        case 'priority-low':
            let priorityOrder2 = { "high": 1, "medium": 2, "low": 3 };
            res_tasks.sort((a, b) => priorityOrder2[b.priority] - priorityOrder2[a.priority]);
            break;
    }
    for(let i=0;i<res_tasks.length;i++){
            res+= `<div class="task-item ${(res_tasks[i].inProccess)?'inProcess':''}" id="${res_tasks[i].id}" >
                        <div class="task-priority priority-${res_tasks[i].priority}"></div>
                        <input type="checkbox" class="task-checkbox">
                        <div class="task-text">${res_tasks[i].text}</div>
                        <small>${res_tasks[i].deadline}</small>
                    </div>`
    }


    currentTaskSection.innerHTML = res;

    attachCheckboxHandlers();
}
function getUpcomingDeadlines(limit = 5, tasks ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);     
    const tasksWithDeadlines = tasks.filter(task => {
        return task.deadline && 
        !task.completed &&
        new Date(task.deadline) >= today
    }
       
    );
    

    tasksWithDeadlines.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    
    updateTasks(tasksWithDeadlines.slice(0, limit),'dashboard');
}
function attachCheckboxHandlers() {
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                this.parentElement.style.opacity = '0.6';
                this.parentElement.style.textDecoration = 'line-through';
                
                let itemid = this.parentElement.id;
                console.log('Удаляем задачу с ID:', itemid);
                complited++;
                localStorage.setItem('todo_tasks_clear_num', JSON.stringify(complited));
                
                for(let i = 0; i < tasks.length; i++){
                    if(tasks[i].id == itemid){
                        tasks = [...tasks.slice(0, i), ...tasks.slice(i + 1, tasks.length)];
                        saveTasks();
                        updateStats();
       
                        setTimeout(() => {
                            this.parentElement.remove();
                        }, 500);
                        break;
                    }
                }
            } else {
                this.parentElement.style.opacity = '1';
                this.parentElement.style.textDecoration = 'none';
            }
        });
    });
    document.querySelectorAll('.task-text').forEach(task => {
        task.addEventListener('click', function() {
            id =this.parentElement.id;

            for(let i=0;i<tasks.length;i++){
                if(tasks[i].id==id){
                    showTaskModal();
                    document.getElementsByClassName('title-task-modal')[0].innerHTML = tasks[i].text; 
                    document.getElementsByClassName('text-task-modal')[0].innerHTML = tasks[i].description;
                    
                }
            }
            
            
        });
    });
}
function dashboard(){
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('future').classList.remove('active');
    document.getElementById('today').classList.remove('active');
    document.getElementById('job-link').classList.remove('active');
    document.getElementById('personal-link').classList.remove('active');
    document.getElementById('buy-link').classList.remove('active');
    document.getElementById('study-link').classList.remove('active');
    document.getElementsByClassName('dashboard')[0].style.display = 'block';
    document.getElementsByClassName('today')[0].style.display = 'none';
    document.getElementsByClassName('future')[0].style.display = 'none';
    document.getElementsByClassName('project')[0].style.display = 'none';

    updateTasks(tasks,'dashboard');
}
function today(){
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('future').classList.remove('active');
    document.getElementById('today').classList.add('active');
    document.getElementById('job-link').classList.remove('active');
    document.getElementById('personal-link').classList.remove('active');
    document.getElementById('buy-link').classList.remove('active');
    document.getElementById('study-link').classList.remove('active');
    document.getElementsByClassName('dashboard')[0].style.display = 'none';
    document.getElementsByClassName('today')[0].style.display = 'block';
    document.getElementsByClassName('future')[0].style.display = 'none';
    document.getElementsByClassName('project')[0].style.display = 'none';


    updateTasks(tasks,'today');
}
function future(){
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('future').classList.add('active');
    document.getElementById('today').classList.remove('active');
    document.getElementById('job-link').classList.remove('active');
    document.getElementById('personal-link').classList.remove('active');
    document.getElementById('buy-link').classList.remove('active');
    document.getElementById('study-link').classList.remove('active');
    document.getElementsByClassName('dashboard')[0].style.display = 'none';
    document.getElementsByClassName('today')[0].style.display = 'none';
    document.getElementsByClassName('future')[0].style.display = 'block';
    document.getElementsByClassName('project')[0].style.display = 'none';

    updateTasks(tasks,'future');
}
function project(){

    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('future').classList.remove('active');
    document.getElementById('today').classList.remove('active');
    document.getElementById('job-link').classList.remove('active');
    document.getElementById('personal-link').classList.remove('active');
    document.getElementById('buy-link').classList.remove('active');
    document.getElementById('study-link').classList.remove('active');
    document.getElementsByClassName('dashboard')[0].style.display = 'none';
    document.getElementsByClassName('today')[0].style.display = 'none';
    document.getElementsByClassName('future')[0].style.display = 'none';
    document.getElementsByClassName('project')[0].style.display = 'block';
}
function job(){
    project();
    document.getElementById('job-link').classList.add('active');
    updateTasks(tasks,'job');
}
function personal(){
    project();
    document.getElementById('personal-link').classList.add('active');
    updateTasks(tasks,'personal');
}
function buy(){
    project();
    document.getElementById('buy-link').classList.add('active');
    updateTasks(tasks,'buy');
}
function study(){
    project();
    document.getElementById('study-link').classList.add('active');
    updateTasks(tasks,'study');
}


   
function startPomodoro() {
  
    const modal = document.getElementById('pomodoroModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    
}

function exportData() {
    alert('📤 Данные экспортированы!');
}

function showReport() {
    alert('📊 Показываем отчёт...');
}

const TimerDisplay = document.getElementById('timer')
const POMODORO_SETTINGS = {
    WORK_TIME: 7 * 60,      // 25 минут в секундах
    SHORT_BREAK: 5 * 60,     // 5 минут
    LONG_BREAK: 20 * 60,     // 20 минут
    SESSIONS_BEFORE_LONG_BREAK: 4  // 4 рабочих сессии
};
let timerState={
    currentTime: POMODORO_SETTINGS.WORK_TIME,
    isRunnig: false,
    mode:'work', //'work', 'short-break', 'long-break'
    complitedSessions: 0,
    currentSessions:0,
    interval : null
}
function startTimer(){
    if( timerState.isRunnig){return;}
    timerState.isRunnig=true;
    timerState.interval = setInterval(updateTimer,10)
    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    showProgress(timerState.currentSessions);

}
function updateTimer(){
    timerState.currentTime--;
    updateDisplay();
}
function pauseTimer(){
    showProgress(timerState.currentSessions)
    TimerDisplay.innerHTML = `${Math.floor(timerState.currentTime/60)}:${timerState.currentTime%60}`
    if(!timerState.isRunnig){return}
    timerState.isRunnig=false;
    clearInterval(timerState.interval)
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
}
function updateDisplay(){
    TimerDisplay.innerHTML = `${Math.floor(timerState.currentTime/60)}:${timerState.currentTime%60}`
    const modeText = document.getElementById('modeText');
    const pomodoroBody = document.getElementById('pomodoroBody');
    const nextBreak = document.getElementById('nextBreak');
    if (timerState.currentTime==0){
        showBrowserNotification()
        playNotificationSound()
        if(timerState.mode=='work'){
            
            timerState.currentSessions++;
            timerState.complitedSessions++;
            
            if(timerState.complitedSessions == POMODORO_SETTINGS.SESSIONS_BEFORE_LONG_BREAK){
                timerState.currentTime = POMODORO_SETTINGS.LONG_BREAK;
                timerState.mode = 'long-break'
                pomodoroBody.className = 'pomodoro-body long-break-mode'
                modeText.className = 'mode-text long-break-text'
                modeText.textContent = 'Длинный перерыв'
                nextBreak.textContent = "Следующий: короткий перерыв(5 мин)"
                timerState.complitedSessions =0;
                timerState.currentSessions=0;
            }else{
                
                timerState.currentTime = POMODORO_SETTINGS.SHORT_BREAK;
                
                timerState.mode = 'short-break'
                pomodoroBody.className = 'pomodoro-body short-break-mode'
                modeText.className = 'mode-text short-break-text'
                modeText.textContent = 'Короткий перерыв'
                if(timerState.complitedSessions==POMODORO_SETTINGS.SESSIONS_BEFORE_LONG_BREAK-1){
                    nextBreak.textContent = "Следующий: длинный перерыв(20 мин)";
                }else{
                    nextBreak.textContent = "Следующий: короткий перерыв(5 мин)"
                }
            }
            pauseTimer()
        }else if(timerState.mode=='short-break'){
            timerState.currentTime = POMODORO_SETTINGS.WORK_TIME;
            timerState.mode = 'work'
            pomodoroBody.className = 'pomodoro-body work-mode'
            modeText.className = 'mode-text work-text'
            modeText.textContent = 'Рабочее время'
            pauseTimer()
            if(timerState.complitedSessions==POMODORO_SETTINGS.SESSIONS_BEFORE_LONG_BREAK-1){
                    nextBreak.textContent = "Следующий: длинный перерыв(20 мин)";
                }else{
                    nextBreak.textContent = "Следующий: короткий перерыв(5 мин)"
                }
        }else if(timerState.mode=='long-break'){
            timerState.currentTime = POMODORO_SETTINGS.WORK_TIME;
            timerState.mode = 'work'
            pomodoroBody.className = 'pomodoro-body work-mode'
            modeText.className = 'mode-text work-text'
            modeText.textContent = 'Рабочее время'
            timerState.complitedSessions=0;
            pauseTimer()
            nextBreak.textContent = "Следующий: короткий перерыв(5 мин)"
        }
    }
}
function resetTimer(){
    pauseTimer();
    pomodoroBody.className = 'pomodoro-body work-mode'
    modeText.className = 'mode-text work-text'
    modeText.textContent = 'Рабочее время'
    if(timerState.complitedSessions==POMODORO_SETTINGS.SESSIONS_BEFORE_LONG_BREAK-1){
        nextBreak.textContent = "Следующий: длинный перерыв(20 мин)";
    }else{
        nextBreak.textContent = "Следующий: короткий перерыв(5 мин)"
    }
    timerState.currentTime = POMODORO_SETTINGS.WORK_TIME;
    timerState.mode='work';
    timerState.complitedSessions=0;
    timerState.currentSessions=0;
    timerState.isRunnig = false;
    pauseTimer()

}
function showProgress(n){
    const container = document.getElementById('progressCircles');
    container.innerHTML = '';
            
    for (let i = 1; i <= 4; i++) {
        const circle = document.createElement('div');
        circle.className = 'progress-circle';
        if (timerState.mode === 'work' && i < n+1) {
            circle.classList.add('completed');
        }
        if (timerState.mode === 'work' && i === n+1) {
            circle.classList.add('current');
        }
                
        if (timerState.mode !== 'work' && i <= n) {
            circle.classList.add('completed');
        }
                
        container.appendChild(circle);
    }
}
 function closePomodoro() {
    document.getElementById('pomodoroModal').style.display = 'none';
}
        // Воспроизведение звука уведомления
        function playNotificationSound() {
            try {
                const audio = document.getElementById('notificationSound');
                audio.currentTime = 0;
                audio.play().catch(e => console.log('Автовоспроизведение звука заблокировано'));
            } catch (e) {
                console.log('Ошибка воспроизведения звука');
            }
        }
        
        // Уведомление браузера
        function showBrowserNotification() {
            if (!("Notification" in window)) return;
            
            if (Notification.permission === "granted") {
                const title = timerState.mode === 'work' ? 'Перерыв!' : 'Время работать!';
                const body = timerState.mode === 'work' 
                    ? 'Рабочая сессия завершена. Отдохните!' 
                    : 'Перерыв окончен. Возвращайтесь к работе!';
                
                new Notification(title, { body: body, icon: '🍅' });
            }
            else if (Notification.permission !== "denied") {
                Notification.requestPermission();
            }
        }
        
        // Запрашиваем разрешение на уведомления при загрузке
        if ("Notification" in window) {
            Notification.requestPermission();
        }
        
        // Закрытие по клику вне окна
        document.addEventListener('click', function(event) {
            const modal = document.getElementById('pomodoroModal');
            const button = document.querySelector('.open-pomodoro-btn');
            
            if (modal.style.display === 'block' && 
                !modal.contains(event.target) && 
                !button.contains(event.target)) {
                closePomodoro();
            }
        });
        
      


 