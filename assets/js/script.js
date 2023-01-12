// global variables to select page elements

var timeholderEl = $("#date-time");
var projectnameinputEl = $("#project-name-input");
var projecttypeinputEl = $("#project-type-input");
var projectdateinputEl = $("#project-date-input");
var projectdisplayEl = $("#project-display-form");
var modalSubmit = $("#modal-submit-button");

// global variables to hold time elements
var currentTime = dayjs().format('h:mm:ss A');
var currentDate = dayjs().format('dddd, MMMM, YYYY');
var timer;

// intitialises the time on the page
function init() {
    timeholderEl.text(currentTime + " on the " + currentDate); 
}

// updates the time every 1000ms
function updateTime () {
    timer = setInterval(function() {
    currentTime = dayjs().format('h:mm:ss A');
    currentDate = dayjs().format('dddd, MMMM, YYYY');
    init()
    }, 1000);
}

// if the key projects in localStorage returns truthy
// projects in the local variable becomes equal to parsed array from local storage and it returned
// if key projects in local storage returns falsy
// projects is returned as an empty array

function readstoredProjects() {
    var projects = localStorage.getItem("projects");
    if (projects) {
        projects = JSON.parse(projects);
    } else {
        projects = [];
    }
    return projects;
}

function printprojectData() {
//The empty() method removes all child nodes and content from the selected elements (Jquery).
        projectdisplayEl.empty();
    var projects = readstoredProjects();
        for (i=0; i <projects.length; i++) {
            var project = projects[i];
            var projectDate = dayjs(project.date);
//this method returns an object of all of the different ways to describe the time at the start of today e.g. 00.00.00 monday 12 (etc.)
            var today = dayjs().startOf('day');
// creates new table row
            var rowEl = $('<tr>');
// creates data cells for a table
// then assigns them text content from the keys specified to be taken from local storage
            var nameEl = $('<td>').text(project.name);
            var typeEl = $('<td>').text(project.type);
// for this element the return from the local storage object key is formatted using .format() to the required format
            var dateEl = $('<td>').text(projectDate.format('DD/MM/YYYY'));
// this variable creates a new table cell with a button inside it labelled X with a data index of i.
// this means that we can keep track of which button is clicked based on the data index of that button
            var deleteEl = $('<td><button class = "btn btn-sm btn-delete-project" data-index ="' + i + '">x</button></td>');
// these lines add an additional class to the row based on how urgent they are
// if the project date is before today it adds a class that turns the row red for example
// isbefore() method indicates whether the Day.js object is before the other supplied date-time.
                if (projectDate.isBefore(today)) {
                    rowEl.addClass('project-late');
// isSame() method indicates whether the Day.js object is the same as the other supplied date-time.
// this indicates that we will probably use startOf() when grabbing the information from the project modal also.
                } else if (projectDate.isSame(today)) {
                    rowEl.addClass('project-today');
                }
//.append() method appends multiple elements simultaneously
                rowEl.append(nameEl, typeEl, dateEl, deleteEl);
                projectdisplayEl.append(rowEl);
        }
}

// this function accepts projects variable from the handle form submit function
// it then stringifies them using JSON and sets them in the local storage under the key projects.
function saveprojectstoStorage(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function handledeleteProject() {
// this variable is parsing an integer (number value rather than string)
// the target selects 'this' meaning (In an event, this refers to the element that received the event.)
// this works because this function will be triggered by an event listener
// it is parsing the data attribute called data index that was added in the printprojectdata() function
// this is a numerical value that corresponds to the row
    var projectIndex = parseInt($(this).attr('data-index'));
// this defines the local variable projects as the return from the readstoredprojects function
    var projects = readstoredProjects();
// the splice method adds or removes array elements.
// the method is splice(which index from the array e.g. [0], how many things to add/remove e.g. 1)
// so here it is deleting the value from the array projects with the index of projectsIndex (the data index of the row), and deleting one value.
    projects.splice(projectIndex, 1);
// it is then saving the returned values using the saveprojectstoStorage function.
    saveprojectstoStorage(projects);
    printprojectData();
}

function handleprojectformSubmit(event) {
        event.preventDefault();
// These three values are taken directly from the inputs on the new project modal
// the first one is trimmed (The trim() method removes whitespace from both ends of a string and returns a new string)
// this is because the user may accidentally include a space (good practice)
    var projectName = projectnameinputEl.val().trim();
    var projectType = projecttypeinputEl.val();
    var projectDate = projectdateinputEl.val();
// this creates a new object with three keys and assigns the values we just took from the inputs within them
    var newProject = {
        name: projectName,
        type: projectType,
        date: projectDate,
    };
// calls whatever information is in the local storage already so that we can update it
    var projects = readstoredProjects();
//pushes the information from the newly created object into the instance of the object on local storage
        projects.push(newProject);
// this line saves projects into storage
        saveprojectstoStorage(projects);
// this line prints the project data on the creen again, now that it has been updated
        printprojectData();
// these lines clear the form inputs so that they can be used again next time
    projectnameinputEl.val('');
    projecttypeinputEl.val('');
    projectdateinputEl.val('');
}


// this is the event listener that will trigger handledeleteproject when you click the X in the row
// here jquery event delegation is used
// the event is delegated to the parent element (the table body), then on click it will be passed to the child element of the class .btn-delete-project
// it will then run handledeleteproject() from that button
projectdisplayEl.on("click", '.btn-delete-project', handledeleteProject);

// This is the event listener on the button on the modal that will call the handleprojectformSubmit() function
modalSubmit.on("click", handleprojectformSubmit);

init();
updateTime();
printprojectData();

