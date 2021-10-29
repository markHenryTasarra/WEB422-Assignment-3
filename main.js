/*********************************************************************************
*  WEB422 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Mark-Henry Tasarra Student ID: 065360125 Date: February 14, 2019
*
********************************************************************************/ 


var viewModel = {
    teams : ko.observable([]),
    employees : ko.observable([]),
    projects : ko.observable([])
};

showGenericModal = (title, message) => {
    $("#genericModal .modal-title").empty().append(title);
    $("#genericModal .modal-body").empty().append(message);
    $("#genericModal").modal('show');
}

initializeTeams = () => {
    return new Promise ((resolve, reject) => {
        $.ajax({
            url : "https://fierce-eyrie-59581.herokuapp.com/teams-raw",
            type : "GET",
            contentType : "application/json"
        }).done((data) => {
            resolve(viewModel.teams = ko.mapping.fromJS(data));
        }).fail(() => {
            reject("Error loading the team data.");
        })
    })
}

initializeEmployees = () => {
    return new Promise ((resolve, reject) => {
        $.ajax({
            url : "https://fierce-eyrie-59581.herokuapp.com/employees",
            type : "GET",
            contentType : "application/json"
        }).done((data) => {
            resolve(viewModel.employees = ko.mapping.fromJS(data));
        }).fail(() => {
            reject("Error loading the employee data.");
        })
    })
}

initializeProjects = () => {
    return new Promise ((resolve, reject) => {
        $.ajax({
            url: "https://fierce-eyrie-59581.herokuapp.com/projects",
            type: "GET",
            contentType : "application/json"
        }).done((data) => {
            resolve(viewModel.projects = ko.mapping.fromJS(data));
        }).fail(() => {
            reject("Error loading the 'project' data.");
        })
    })
}

saveTeam = () => {
    let currentTeam = this;

    $.ajax({
        url: "https://fierce-eyrie-59581.herokuapp.com/team/:" + currentTeam._id,
        type: "PUT",
        contextType : "application/json",
        data: JSON.stringify({
            Projects: currentTeam.Projects,
            Employees: currentTeam.Employees,
            TeamLead: currentTeam.TeamLead
        })
    }).done(() => {
        showGenericModal("Success", currentTeam.TeamName + "updated successfully.");
    }).fail(() => {
        showGenericModal("Error", "Error updating the team information.");
    })
}

$(document).ready(() => {
    console.log(`jQuery working!`);
        initializeTeams()
        .then(initializeEmployees)
        .then(initializeProjects)
        .then(() => {
        //Use knockout to apply the bindings (applybindings)
        //to the document using the "viewModel" (defined at the top of our file)
        ko.applyBindings(viewModel, $("body")[0]);

        //Use jQuery to select all "select" elements with class "multiple" 
        $("select.multiple").multipleSelect({ filter: true });

        //Use jQuery to select all "select" elements with class "single"
        $("select.single").multipleSelect({ single: true, filter: true }); 
    }).catch((err) => {
        //Take the message from the rejected promise and provides it to a generic 
        //error modal as the message value
        showGenericModal("Error", err);
    })
})