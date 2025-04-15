//Load items
//Render items
//Add/remove items

let items = [];
let completedItems = [];
const completedStorageKey = "completedItems";



const itemsDiv = document.getElementById("items");
const input = document.getElementById("itemInput");
const storageKey = "items";


function renderItems(){
    itemsDiv.innerHTML = null;

    for(const [idx, item] of Object.entries(items)){
//object.entries allows me to loop through items array and access index/item at the same time.
        const container = document.createElement("div");
        container.style.marginBottom = "10px";   
        
        
        const text = document.createElement("p");
        text.textContent = item;
        text.style.display = "inline";
        text.style.margin = "10px";


        //SECTION FOR THE BUTTON CONTAINER//
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.alignItems = "center";


        //EDIT BUTTON//
        const editButton = document.createElement("button");
        editButton.onclick = () => editItem(idx);
        const editIcon = document.createElement("img");
        editIcon.src = "imgs/pencil.svg";
        editIcon.alt = "Edit Item";
        editIcon.style.width = "16px";
        editIcon.style.height = "16px";

        editButton.appendChild(editIcon);


        //DELETE BUTTON//
        const deleteButton  = document.createElement("button");
        deleteButton.onclick = () =>removeItem(idx);//arrow nottion in this context is wrapper syntax
        //Create an image element for the dustbin icon
        const deleteIcon = document.createElement("img");
        deleteIcon.src = "imgs/trash.svg";
        deleteIcon.alt = "Delete Item";
        deleteIcon.style.width = "16px";
        deleteIcon.style.height = "16px";

        deleteButton.appendChild(deleteIcon);

        //CALENDAR BUTTON//
        const calendarButton = document.createElement("button");
        calendarButton.classList.add("calendar-button");
        calendarButton.onclick = () => {
            modal.style.display = "block";
        };
        const calendarIcon = document.createElement("img");
        calendarIcon.src = "imgs/calendar-day.svg";
        calendarIcon.alt = "Schedule your task";
        calendarIcon.style.width = "16px";
        calendarIcon.style.height = "16px";

        calendarButton.appendChild(calendarIcon);


        //SECTION FOR RADIO BUTTON
        const completedButton = document.createElement("input");
        completedButton.type = "checkbox";
        completedButton.classList.add("complete-task");
        completedButton.alt = "Completed";
        completedButton.onclick = () => toggleComplete(idx);


        //SECTION FOR COMPLETED TASKS BUTTON//
        //const completedTasks = getElementsByClassName(".completed-content");


        






        //Append buttons
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        buttonContainer.appendChild(calendarButton);
        buttonContainer.appendChild(completedButton);

        container.appendChild(text);
        container.appendChild(buttonContainer);
        itemsDiv.appendChild(container);

    }
}


function renderCompletedTasks() {
    const completedTasksContainer = document.querySelector(".completed-content");
    if (!completedTasksContainer) return;

    completedTasksContainer.innerHTML = ""; // Clear previous tasks

    for (const task of completedItems) {
        const completedTaskDiv = document.createElement("div");
        completedTaskDiv.style.marginBottom = "10px";
        completedTaskDiv.style.display = "flex";
        completedTaskDiv.style.justifyContent = "space-between";
        completedTaskDiv.style.alignItems = "center";
        completedTaskDiv.style.backgroundColor = "white";
        completedTaskDiv.style.padding = "10px 15px";
        completedTaskDiv.style.borderRadius = "50px";
        completedTaskDiv.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";

        const completedText = document.createElement("p");
        completedText.textContent = task;
        completedText.style.margin = "10px";
        completedText.style.textDecoration = "line-through";
        completedText.style.color = "gray";
        completedText.style.display = "inline";

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.alignItems = "center";

        // Restore button (if you ever want to implement restore later)
        const restoreButton = document.createElement("button");
        restoreButton.title = "Restore (optional)";
        const restoreIcon = document.createElement("img");
        restoreIcon.src = "imgs/refresh.svg";
        restoreIcon.alt = "Restore Task";
        restoreIcon.style.width = "16px";
        restoreIcon.style.height = "16px";
        restoreButton.appendChild(restoreIcon);

        restoreButton.onclick = () => {
            items.push(task);
            completedItems.splice(completedItems.indexOf(task), 1);
            saveItems();
            saveCompletedItems();
            renderItems();
            renderCompletedTasks();
        };

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.style.marginLeft = "15px";
        const deleteIcon = document.createElement("img");
        deleteIcon.src = "imgs/trash.svg";
        deleteIcon.alt = "Delete Task";
        deleteIcon.style.width = "16px";
        deleteIcon.style.height = "16px";
        deleteButton.appendChild(deleteIcon);
        deleteButton.onclick = () => {
            completedItems.splice(completedItems.indexOf(task), 1);
            saveCompletedItems();
            renderCompletedTasks();
        };

        buttonContainer.appendChild(restoreButton); // optional
        buttonContainer.appendChild(deleteButton);

        completedTaskDiv.appendChild(completedText);
        completedTaskDiv.appendChild(buttonContainer);
        completedTasksContainer.appendChild(completedTaskDiv);
    }
}


//FUNCTION TO SCHEDULE REMINDERS
function scheduleReminder(idx) {
    
}


function loadItems() {
    const username = localStorage.getItem('username');
    if (!username) return;

    const oldItems = localStorage.getItem(`items_${username}`);
    if (oldItems) items = JSON.parse(oldItems);

    const oldCompleted = localStorage.getItem(`completedItems_${username}`);
    if (oldCompleted) completedItems = JSON.parse(oldCompleted);

    renderItems(); // Render all tasks at once
    renderCompletedTasks(); // Render all completed tasks
}
7



function saveItems() {
    const username = localStorage.getItem('username');  // Get the logged-in user's username
    if (username) {
        const stringItems = JSON.stringify(items);  // Convert the tasks array to a string
        localStorage.setItem(`items_${username}`, stringItems);  // Save tasks under the user's unique key
    }
}



function saveCompletedItems() {
    const username = localStorage.getItem('username'); // Get the logged-in username
    if (!username) return; // If no user is logged in, exit

    const stringCompleted = JSON.stringify(completedItems);
    localStorage.setItem(`completedItems_${username}`, stringCompleted);
}




function addItem(){
    
    const username = localStorage.getItem('username'); // Get the logged-in username
    if (!username) return; // If no user is logged in, exit


    const value = input.value.trim();
    if(!value){
        alert("You cannot add an empty item");
        return;
    }
    items.push(value);
    renderItems();
    input.value = "";
    saveItems();  // Save the item to the logged-in user's storage
}



function editItem(idx){
    const newValue = prompt("Edit item: ", items[idx]);

    if(newValue !== null && newValue.trim() !== ""){
        items[idx] = newValue.trim();
        renderItems();
        saveItems();
    }

}

function toggleComplete(idx) {
    const username = localStorage.getItem('username');
    if (!username) return;

    const radioButton = document.querySelectorAll(".complete-task")[idx];
    const taskText = document.querySelectorAll("#items p")[idx];

    if (radioButton.checked) {
        taskText.style.textDecoration = "line-through";
        moveTocompletedTasks(idx);
    } else {
        taskText.style.textDecoration = "none";
        restoreFromCompletedTasks(idx);  // Implement a function to move tasks back
    }
}


// Function to move completed tasks to the completed section for the logged-in user
function moveTocompletedTasks(idx) {
    const username = localStorage.getItem('username'); // Get the logged-in username
    if (!username) return; // If no user is logged in, exit

    completedItems.push(items[idx]);
    saveCompletedItems();

    removeItem(idx, false); // Don't re-render yet
    renderItems(); // Re-render active tasks
    renderCompletedTasks(); // Re-render completed tasks
}





function calendar(){

}

function removeItem(idx, shouldRender = true){
    const username = localStorage.getItem('username'); // Get the logged-in username
    if (!username) return; // If no user is logged in, exit

    items.splice(idx, 1);
    if(shouldRender) renderItems();
    saveItems();  // Save changes to the logged-in user's storage
}




document.addEventListener("DOMContentLoaded", loadItems);

//get the modal
const modal = document.getElementById("calendarModal");

//Get the button that opens the modal
const calendarButtons = document.querySelectorAll("#items .calendar-button");

//get the span element that closes the model
const span = document.getElementsByClassName("close")[0];

//Get the save button inside the modal
const saveScheduleButton = document.getElementById("saveScheduleButton");

//Add event listeners to open the modal
calendarButtons.forEach(button => {
    button.addEventListener("click", () => {
        modal.style.display = "block";
    });
});

//Add event listener to save the schedule
saveScheduleButton.addEventListener("click", () => {
    const scheduleInput = document.getElementById("scheduleInput");
    const scheduleDateTime = scheduleInput.value;

    if(scheduleDateTime){
        alert("Task schdeuled for: " + scheduleDateTime) ;
        modal.style.display = "none";
    }else{
        alert("Please select a date and time.");
    }
});

//Close the modal if the user clicks anywhere outside of the it
window.addEventListener("click", (Event) => {
    if(Event.target === modal){
        modal.style.display = "none";
    }
});

//CODE FOR CLOSING THE MODAL
span.addEventListener("click", () => {
    modal.style.display = "none";
});


document.addEventListener("DOMContentLoaded", () => {
    loadItems();
    
    // Add event listener for Enter key on input field
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission if it's within a form
            addItem();
        }
    });
 
    
    // Get the username from localStorage
    const username = localStorage.getItem('username'); // Get username from localStorage
    
    if (username) {
        document.getElementById('username').textContent = username; // Update the placeholder with the username
    } else {
        document.getElementById('username').textContent = 'Guest'; // Default to "Guest" if no user is logged in
    }
});

   // Bind the logout function to the logout button on page load
   document.addEventListener("DOMContentLoaded", function() {
    const logoutButton = document.getElementById("logoutBtn");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout); // Add the event listener
    }
});









//GET THE EDIT MODAL AND RELATED ELEMENTS
const editItemModal = document.getElementById("editItemModal");
const closeEditButton = document.querySelector(".close-edit");
const saveEditButton = document.getElementById("saveEditButton");
const editInput = document.getElementById("editInput");

//varible to store index of item being edited
let currentEditIndex = null;

//function to show the edit modal
function editItem(idx){
    currentEditIndex = idx;
    editInput.value = items[idx];
    editItemModal.style.display = "block";
}

//event listener to close modal
closeEditButton.addEventListener("click", () =>{
    editItemModal.style.display = "none";
});

//event listener for save changes
saveEditButton.addEventListener("click", () =>{
    const newValue = editInput.value.trim();

    if(newValue !== ""){
        items[currentEditIndex] = newValue;
        renderItems();
        saveItems();
        editItemModal.style.display = "none";
    }else{
        alert("Please enter a valid value.");

    }

});

editInput.addEventListener("keydown", (Event) => {
    if(Event.key === "Enter"){
        Event.preventDefault();
        saveEditButton.click();
    }
})

//close the modal if the user clicks anywhere outside of it
window.addEventListener("click", (Event) =>{
    if(Event.target === editItemModal){
        editItemModal.style.display = "none";
    }
});


// Add this inside the last DOMContentLoaded event listener or at the end of your script
const addButton = document.getElementById("addButton");
if (addButton) {
    addButton.addEventListener("click", addItem);
}


