document.getElementById('create-board-button').onclick = function () {
    document.getElementById('create-board-button').classList.remove('visible');
    document.getElementById('create-board-button').classList.add('invisible');
    document.getElementById('create-board-button-active').classList.remove('invisible');
    document.getElementById('create-board-button-active').classList.add('visible');
};
document.getElementById('create-board-back-button').onclick = function () {
    document.getElementById('create-board-button').classList.remove('invisible');
    document.getElementById('create-board-button').classList.add('visible');
    document.getElementById('create-board-button-active').classList.remove('visible');
    document.getElementById('create-board-button-active').classList.add('invisible');
};

document.getElementById('create-board-create-button').onclick = async function () {
    let name = document.getElementById('create-board-name-textbox').value;
    document.getElementById('create-board-name-textbox').value = '';
    let description = document.getElementById('create-board-description-textbox').value;
    document.getElementById('create-board-description-textbox').value = '';
    let response = await fetch('/board_api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            'name': name,
            'description': description
        })
    });
    if (response.status == 201) {
        let description = await response.json();
        let list = document.getElementById('boards-list');
        let newboard = document.createElement('li');
        newboard.className = 'board-list-item-container';
        newboard.innerHTML = '<div class="board-list-item board">\n' +
            '                    <div id="item-default-view-' + description.id + '" class="visible-flex">\n' +
            '                        <div class="title">\n' +
            '                            <a href="/board/' + description.id + '" class="no-underline">\n' +
            '                                <span id="board-name-' + description.id + '">\n' +
            '                                    ' + description.name + '\n' +
            '                                </span>\n' +
            '                            </a>\n' +
            '                            <button class="fa-white-button" onclick="changeViewToEdit(\'' + description.id + '\')">\n' +
            '                                <i class="fas fa-pen"></i>\n' +
            '                            </button>\n' +
            '                        </div>\n' +
            '                        <div class="description">\n' +
            '                            <span id="board-description-' + description.id + '">\n' +
            '                                ' + description.description + '\n' +
            '                            </span>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                    <div id="item-edit-view-' + description.id + '" class="invisible">\n' +
            '                        <input type="text" style="width: 100%; box-sizing: border-box" id="edit-view-board-name-' + description.id + '" value="' + description.name + '">\n' +
            '                        <input type="text" style="width: 100%; box-sizing: border-box" id="edit-view-board-description-' + description.id + '" value="' + description.description + '">\n' +
            '                        <div style="display: flex; justify-content: space-between">\n' +
            '                            <input type="button" class="enter-button"\n' +
            '                                   value="Edit"\n' +
            '                                   onclick="saveEdited(\'' + description.id + '\')"/>\n' +
            '                            <button type="button"\n' +
            '                                    class="fa-white-button"\n' +
            '                                    onclick="changeViewToDefault(\'' + description.id + '\')">\n' +
            '                                <i class="fas fa-times fa-2x"></i>\n' +
            '                            </button>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>';
        list.children[list.children.length - 1].before(newboard);
    } else {
        let text = await response.text();
        alert(text);
        console.log(response);
        console.log(text);
    }
};

async function saveEdited(id) {
    let name = document.getElementById('edit-view-board-name-' + id).value;
    let description = document.getElementById('edit-view-board-description-' + id).value;
    let response = await fetch('/board_api/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            'name': name,
            'description': description
        })
    });
    document.getElementById('board-name-' + id).innerText = name;
    document.getElementById('board-description-' + id).innerText = description;
    changeViewToDefault(id);
}

function changeViewToEdit(id) {
    document.getElementById('item-edit-view-' + id).classList.remove('invisible');
    document.getElementById('item-edit-view-' + id).classList.add('visible');
    document.getElementById('item-default-view-' + id).classList.remove('visible');
    document.getElementById('item-default-view-' + id).classList.add('invisible');
}

function changeViewToDefault(id) {
    document.getElementById('item-default-view-' + id).classList.remove('invisible');
    document.getElementById('item-default-view-' + id).classList.add('visible');
    document.getElementById('item-edit-view-' + id).classList.remove('visible');
    document.getElementById('item-edit-view-' + id).classList.add('invisible');
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}