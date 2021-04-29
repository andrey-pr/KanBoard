document.getElementById('delete-board-button').onclick = async function () {
    if (confirm("Are you sure?")) {
        let response = await fetch('/board_api/' + document.body.dataset.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        window.location = '/board_list';
    }
};

document.getElementById('add-column-button').onclick = function () {
    document.getElementById('add-column-button').classList.remove('visible');
    document.getElementById('add-column-button').classList.add('invisible');
    document.getElementById('add-column-button-active').classList.remove('invisible');
    document.getElementById('add-column-button-active').classList.add('visible');
};
document.getElementById('add-column-back-button').onclick = function () {
    document.getElementById('add-column-button').classList.remove('invisible');
    document.getElementById('add-column-button').classList.add('visible');
    document.getElementById('add-column-button-active').classList.remove('visible');
    document.getElementById('add-column-button-active').classList.add('invisible');
};

document.getElementById('create-column-button').onclick = async function () {
    let name = document.getElementById('create-column-name-textbox').value;
    let response = await fetch('/task_column_api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            'name': name,
            'board': document.body.dataset.id
        })
    });
    if (response.status == 201) {
        let description = await response.json();
        let list = document.getElementById('main-container');
        let newColumn = document.createElement('div');
        newColumn.className = 'task-list-container';
        newColumn.id = 'task-column-' + description.id;
        newColumn.dataset.id = description.id;
        newColumn.innerHTML = '<div class="task-list-title-container">\n' +
            '                <div class="task-list-title-view-container visible-flex" id="col-name-view-' + description.id + '">\n' +
            '                    <div class="task-list-title" id="col-name-field-' + description.id + '"> ' + description.name + ' </div>\n' +
            '                    <div>\n' +
            '                        <button class="fa-grey-button" onclick="changeColumnViewToEdit(\'' + description.id + '\')">\n' +
            '                            <i class="fas fa-pen"></i>\n' +
            '                        </button>\n' +
            '                        <button class="fa-grey-button" onclick="deleteColumn(\'' + description.id + '\')">\n' +
            '                            <i class="fas fa-trash-alt"></i>\n' +
            '                        </button>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <div id="col-name-edit-view-' + description.id + '" class="invisible">\n' +
            '                    <input type="text" id="col-name-edit-field-' + description.id + '" style="margin-right: 10px;">\n' +
            '                    <div style="display: flex; flex-direction: column">\n' +
            '                        <button class="fa-grey-button"\n' +
            '                                onclick="saveEditedColumn(\'' + description.id + '\')">\n' +
            '                            <i class="fas fa-check"></i>\n' +
            '                        </button>\n' +
            '                        <button class="fa-grey-button"\n' +
            '                                onclick="changeColumnViewToDefault(\'' + description.id + '\')">\n' +
            '                            <i class="fas fa-times"></i>\n' +
            '                        </button>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            <div class="task-list" id="task-list-' + description.id + '" data-id="' + description.id + '">\n' +
            '            </div>\n' +
            '            <button class="add-task-button visible-inline" id="add-task-button-' + description.id + '" type="button"\n' +
            '                    onclick="changeTaskViewToCreate(\'' + description.id + '\')">\n' +
            '                <i class="fas fa-plus"></i>\n' +
            '                Add another task\n' +
            '            </button>\n' +
            '            <div class="input-with-button-block invisible" id="add-task-button-active-' + description.id + '">\n' +
            '                <input type="text" placeholder="Enter a title for this card..." maxlength="120" id="create-task-title-' + description.id + '"/>\n' +
            '                <input type="button" class="enter-button" value="Create" data-column="' + description.id + '" onclick="createTask(\'' + description.id + '\')"/>\n' +
            '                <button class="back-button" onclick="changeTaskCreatingViewToDefault(\'' + description.id + '\')">\n' +
            '                    <i class="fas fa-times"></i>\n' +
            '                </button>\n' +
            '            </div>';
        list.children[list.children.length - 2].before(newColumn);
        makeSortable(document.getElementById('task-list-' + description.id));
    }
    document.getElementById('create-column-name-textbox').value = "";
};

let arr = document.getElementById('main-container').children;
for (let i = 0; i < arr.length - 2; i++) {
    makeSortable(document.getElementById('task-list-' + arr[i].dataset.id));
}

function makeSortable(el) {
    new Sortable(el, {
        group: 'all',
        sort: false,
        onAdd: async function (e) {
            console.log(e.item);
            let columnId = e.target.dataset.id;
            let taskId = e.item.dataset.id;
            let response = await fetch('/task_api/' + taskId, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    'column': columnId
                })
            });
            console.log(response)
            console.log(response.text())
        }
    })
}


function changeColumnViewToEdit(id) {
    document.getElementById('col-name-edit-view-' + id).classList.remove('invisible');
    document.getElementById('col-name-edit-view-' + id).classList.add('visible-flex');
    document.getElementById('col-name-view-' + id).classList.remove('visible-flex');
    document.getElementById('col-name-view-' + id).classList.add('invisible');
    document.getElementById('col-name-edit-field-' + id).value = document.getElementById('col-name-field-' + id).innerText;
}

function changeColumnViewToDefault(id) {
    document.getElementById('col-name-view-' + id).classList.remove('invisible');
    document.getElementById('col-name-view-' + id).classList.add('visible-flex');
    document.getElementById('col-name-edit-view-' + id).classList.remove('visible-flex');
    document.getElementById('col-name-edit-view-' + id).classList.add('invisible');
}

async function saveEditedColumn(id) {
    let result = document.getElementById('col-name-edit-field-' + id).value;
    let response = await fetch('/task_column_api/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            'name': result
        })
    });
    document.getElementById('col-name-field-' + id).innerText = result;
    changeColumnViewToDefault(id);
}

async function deleteColumn(id) {
    if (confirm("Are you sure?")) {
        let response = await fetch('/task_column_api/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        document.getElementById('task-column-' + id).remove();
    }
}

function changeTaskViewToCreate(id) {
    document.getElementById('add-task-button-active-' + id).classList.remove('invisible');
    document.getElementById('add-task-button-active-' + id).classList.add('visible-inline');
    document.getElementById('add-task-button-' + id).classList.remove('visible-inline');
    document.getElementById('add-task-button-' + id).classList.add('invisible');
}

function changeTaskCreatingViewToDefault(id) {
    document.getElementById('add-task-button-' + id).classList.remove('invisible');
    document.getElementById('add-task-button-' + id).classList.add('visible-inline');
    document.getElementById('add-task-button-active-' + id).classList.remove('visible-inline');
    document.getElementById('add-task-button-active-' + id).classList.add('invisible');
}

async function createTask(id) {
    let title = document.getElementById('create-task-title-' + id).value;
    let response = await fetch('/task_api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            'title': title,
            'column': id
        })
    });
    if (response.status == 201) {
        let description = await response.json();
        let list = document.getElementById('task-list-' + id);
        let newColumn = document.createElement('div');
        newColumn.className = 'task-item';
        newColumn.id = 'task-item-' + description.id;
        newColumn.dataset.id = description.id;
        newColumn.innerHTML = '<div class="visible-flex" id="task-item-default-view-' + description.id + '" style="display: flex; justify-content: space-between;">\n' +
            '                            <div id="task-name-' + description.id + '">' + description.title + '</div>\n' +
            '                            <div>\n' +
            '                                <button class="fa-grey-button" onclick="changeTaskViewToEdit(\'' + description.id + '\')">\n' +
            '                                    <i class="fas fa-pen"></i>\n' +
            '                                </button>\n' +
            '                                <button class="fa-grey-button" onclick="deleteTask(\'' + description.id + '\')">\n' +
            '                                    <i class="fas fa-trash-alt"></i>\n' +
            '                                </button>\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                        <div class="invisible" id="task-item-edit-view-' + description.id + '" style="display: flex">\n' +
            '                            <input style="width: auto" type="text" id="task-name-field-' + description.id + '">\n' +
            '                            <div style="display: flex; flex-direction: column">\n' +
            '                                <button class="fa-grey-button"\n' +
            '                                        onclick="saveEditedTask(\'' + description.id + '\')">\n' +
            '                                    <i class="fas fa-check"></i>\n' +
            '                                </button>\n' +
            '                                <button class="fa-grey-button"\n' +
            '                                        onclick="changeTaskViewToDefault(\'' + description.id + '\')">\n' +
            '                                    <i class="fas fa-times"></i>\n' +
            '                                </button>\n' +
            '                            </div>\n' +
            '                        </div>';
        list.append(newColumn);
    }
    document.getElementById('create-task-title-' + id).value = '';
    changeTaskCreatingViewToDefault(id);
}

function changeTaskViewToEdit(id) {
    document.getElementById('task-item-edit-view-' + id).classList.remove('invisible');
    document.getElementById('task-item-edit-view-' + id).classList.add('visible-flex');
    document.getElementById('task-item-default-view-' + id).classList.remove('visible-flex');
    document.getElementById('task-item-default-view-' + id).classList.add('invisible');
    document.getElementById('task-name-field-' + id).value = document.getElementById('task-name-' + id).innerHTML;
}

function changeTaskViewToDefault(id) {
    document.getElementById('task-item-default-view-' + id).classList.remove('invisible');
    document.getElementById('task-item-default-view-' + id).classList.add('visible-flex');
    document.getElementById('task-item-edit-view-' + id).classList.remove('visible-flex');
    document.getElementById('task-item-edit-view-' + id).classList.add('invisible');
}

async function saveEditedTask(id) {
    let result = document.getElementById('task-name-field-' + id).value;
    let response = await fetch('/task_api/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            'title': result
        })
    });
    document.getElementById('task-name-' + id).innerText = result;
    changeTaskViewToDefault(id);
}

async function deleteTask(id) {
    if (confirm("Are you sure?")) {
        let response = await fetch('/task_api/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        document.getElementById('task-item-' + id).remove();
    }
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}