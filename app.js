// Documentation :  // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML

const clearBtn = document.querySelector(".clear");
const uploadBtn = document.querySelector(".upload");
const toDoList = document.querySelector("#list");
const toDoInput = document.querySelector("#input")
const toDoAddBtn = document.querySelector(".fa-plus-circle");

//Selecting the icon class names 
const checkBtn = "fa-check-circle";
const uncheckBtn = "fa-circle-thin";
const textLineThrough = "line-through";

//To Do Container

let toDoContainer, id;

let toDoData = localStorage.getItem("to-do-item");

if (toDoData) {
    toDoContainer = JSON.parse(toDoData);
    id = toDoContainer.length;
    loadToDoContainer(toDoContainer);
} else {
    toDoContainer = [];
    id = 0;
}

function loadToDoContainer(array) {
    array.forEach(function(item) {
        addToDo(item.name, item.id, item.done, item.trash);
    })
}

// Clear local storage 

clearBtn.addEventListener("click", function() {
    localStorage.clear();
    location.reload();
})

uploadBtn.addEventListener("click", async function() {
    let values = JSON.parse(localStorage.getItem("to-do-item"));
    console.log(values);
    for(let i = 0; i < values.length; i++) {
        if(values[i].trash) {
            values[i].trash = false;
            values[i].done = false;
            addToDo(values[i].name, values[i].id, values[i].done, values[i].trash);
            localStorage.clear();

        } else if(!values[i].trash) {
            continue;
        } else {
            values[i].done = false;
            addToDo(values[i].name, values[i].id, values[i].done, values[i].trash);
        }

    }
});

//add To Do function
function addToDo(
    toDo,
    id,
    done,
    trash
) {
    if (trash) return;

    const toDoDone = done ? checkBtn : uncheckBtn;
    const toDoLine = done ? textLineThrough : "";
    const item = `
                <li class="item">
                    <i class="fa ${toDoDone} complete" status="complete" id="${id}"></i>  
                    <p class="text" ${toDoLine}>${toDo}</p>
                    <i class="fa fa-trash-o delete" status="delete" id="${id}"></i>
                </li>
                `;

    const toDoItemPosition = "beforeend";
    toDoList.insertAdjacentHTML(toDoItemPosition, item);
}


//Adding a Task to the List on enter key press

document.addEventListener("keyup", displayToDo);

//Adding a Task to the List on plus icon click

toDoAddBtn.addEventListener("click", displayToDo);

//displayToDo Function

function displayToDo(e) {
    if (e.keyCode === 13 || e.target.classList.value === "fa fa-plus-circle") {
        const toDo = input.value;
        //checking whether input field is NOT empty
        if (toDo) {
            addToDo(toDo, id, false, false);
            toDoContainer.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            });

        //Persisting/updating local storage
            localStorage.setItem("to-do-item", JSON.stringify(toDoContainer));

            id++;
        }
        input.value = "";
    }
}


//When a task is completed/ removed

function completeToDo(toDoItem) {
    toDoItem.classList.toggle(checkBtn);
    toDoItem.classList.toggle(uncheckBtn);
    toDoItem.parentNode.querySelector(".text").classList.toggle(textLineThrough);
    toDoContainer[toDoItem.id].done = toDoContainer[toDoItem.id].done ? false : true;
}

function removeToDo(toDoItem) {
    toDoItem.parentNode.parentNode.removeChild(toDoItem.parentNode);
    toDoContainer[toDoItem.id].trash = true;
}

//Targeting the dinamically created to do items

toDoList.addEventListener("click", function(e) {

    if (e.path[0].localName === "i") {
        const toDoItem = e.target;
        const toDoStatus = toDoItem.attributes.status.value;
        if(toDoStatus === "complete") {
            completeToDo(toDoItem);
        } else if (toDoStatus === "delete") {
            removeToDo(toDoItem);
        }
        localStorage.setItem("to-do-item", JSON.stringify(toDoContainer));
    }
});

