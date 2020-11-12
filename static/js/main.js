var selected_userlist = [], users_dictlist, initial_selected_userlist = [];


$(document).ready(function() {
    $('.options').tooltip({ delay: { show: 200, hide: 0 } });
});


// Users & Groups (Start) ======================================================================================================================
function addUser() {
    if ($('#user-form-new .user-input').length == 0) {
        const form = document.getElementById('user-form-new');
        form.hidden = false;
        form.innerHTML += `<div class="user-input">
                                <div class="user-icon"><ion-icon name="person-circle-sharp"></ion-icon></div>
                                <div class="user-personal form-group">
                                    <input type="text" id="new-name" class="name form-control" name="fullname" placeholder="Full Name" required>
                                    <input id="new-email" type="email" class="email form-control" name="email" placeholder="Email" required>
                                </div>
                                <div class="user-position form-group"><input id="new-position" type="text" class="position form-control" name="position" placeholder="Position" required></div>
                                <div class="user-confirm-btn"><a class="options" href='#' onclick="submitAddUserForm();" data-toggle="tooltip" data-placement="top" title="Confirm"><ion-icon name="checkmark-outline"></ion-icon></a></div>
                                <div class="user-cancel-btn"><a class="options" href="#" onclick="cancelAddUserForm();" data-toggle="tooltip" data-placement="top" title="Cancel"><ion-icon name="close-outline"></ion-icon></a></div>
                            </div>
                            <hr>`;
        $('.options').tooltip({ delay: { show: 200, hide: 0 } });
        $('#new-name').focus();
    }
    else {
        $('#new-name').focus();
    }
}

function addGroup() {
    if ($('#group-form-new .group-input').length == 0) {
        const form = document.getElementById('group-form-new');
        form.hidden = false;
        form.innerHTML += `<div class="group-input">
                                <div class="group-icon i1"><ion-icon name="person-circle-sharp"></ion-icon></div>
                                <div class="group-icon i2"><ion-icon name="person-circle-sharp"></ion-icon></div>
                                <div class="group-icon i3"><ion-icon name="person-circle-sharp"></ion-icon></div>
                                <div class="group-name form-group">
                                    <input type="text" id="new-groupname" class="groupname form-control" name="groupname" placeholder="Group Name" required>
                                </div>
                                <button type="button" class="btn btn-primary" onclick="getUsersA();">+/- Users</button>
                                <div class="group-confirm-btn"><a class="options" href='#' onclick="submitAddGroupForm();" data-toggle="tooltip" data-placement="top" title="Confirm"><ion-icon name="checkmark-outline"></ion-icon></a></div>
                                <div class="group-cancel-btn"><a class="options" href="#" onclick="cancelAddGroupForm();" data-toggle="tooltip" data-placement="top" title="Cancel"><ion-icon name="close-outline"></ion-icon></a></div>
                            </div>
                            <hr>`;
        $('.options').tooltip({ delay: { show: 200, hide: 0 } });
        $('#new-groupname').focus();
    }
    else {
        $('#new-groupname').focus();
    }
}

async function getUsersA() {
    const response = await fetch("/usergroups/getusers");
    users_dictlist = await response.json();
    selected_userlist = [];
    displayUsers(users_dictlist, false);
    $('#choose-users').modal();
}

async function getUsersE(id) {
    const response = await fetch(`/usergroups/getusers/${parseInt(id)}`);
    const data = await response.json();
    initial_selected_userlist = data[0];
    selected_userlist = [...initial_selected_userlist];
    users_dictlist = data[1];
    displayUsers(users_dictlist, false);
    $('#choose-users').modal();
}

function closeChip(element, id) {
    $(element).parent('div').remove();
    for (let user of users_dictlist) {
        if (user["id"] == id) {
            selected_userlist.splice(selected_userlist.indexOf(id), 1);
            displayUsers(users_dictlist, true);
            break;
        }
    }
}

function processCheckbox(uid) {
    for (let user of users_dictlist) {
        if (user["id"] == uid) {
            document.getElementById('all-chips').innerHTML += `<div class="chip">
                                                                    ${user["fullname"]}
                                                                    <span id="chip-close${user["id"]}" class="closebtn" onclick="closeChip(this, ${user["id"]})">&times;</span>
                                                            </div>`;
            selected_userlist.push(user["id"]);
            displayUsers(users_dictlist, true);
            break;
        }
    }
}

function displayUsers(users, f) {
    const all_users = document.getElementById('modal-users');
    all_users.innerHTML = "";
    all_users.style.display = "block";
    let count = 1;
    if (selected_userlist.length == 0) {
        for (let user of users) {
            const option = `<input type="checkbox" name="${count}" id="uc${count}" value="${user["id"]}" onclick="processCheckbox(${user["id"]});"/>
                            <label for="uc${count}">${user["fullname"]} <i>(${user["position"]})</i></label>`; 
            all_users.innerHTML += option;
            count += 1;
        }
    }
    else {
        for (let user of users) {
            let flag = false;
            for (let selected_user of selected_userlist) {
                if (user["id"] == selected_user) {
                    flag = true;
                    if (f == false) {
                        document.getElementById('all-chips').innerHTML += `<div class="chip">
                                                                            ${user["fullname"]}
                                                                            <span id="chip-close${user["id"]}" class="closebtn" onclick="closeChip(this, ${user["id"]})">&times;</span>
                                                                        </div>`;
                    }
                    break;
                }
            }
            if (flag == false) {
                all_users.innerHTML += `<input type="checkbox" name="${count}" id="uc${count}" value="${user["id"]}" onclick="processCheckbox(${user["id"]});"/>
                                        <label for="uc${count}">${user["fullname"]} <i>(${user["position"]})</i></label>`;;
                count += 1;
            }
        }
    }
}

$('.modal-body .modal-search #search').on('keyup', function() {
    const value = $(this).val();
    const returned_users = searchUserList(value, users_dictlist);
    displayUsers(returned_users, true);
});


function toggleClickEvent() {
    displayUsers(users_dictlist, true);
    $('#choose-users').modal();
}

function closeModal() {
    $('.group-input .btn.btn-primary').attr("onclick", "toggleClickEvent();")
}

function searchUserList(value, searchlist) {
    let filtered_users = [];
    for (let user of searchlist) {
        value = value.toLowerCase();
        const lowercased_user = user["fullname"].toLowerCase();
        if (lowercased_user.includes(value)) {
            filtered_users.push(user);
        }
    }
    return filtered_users;
}

function saveSelectedUsers() {
    $('#choose-users').modal("hide");
    if (document.getElementById('group-form-new').hidden == false) {
        $('#group-form-new .group-input .btn.btn-primary').replaceWith(`<div class="group-participants"><p class="participants">${selected_userlist.length} people</p></div>`);
    }
    else if (document.getElementById('group-form-edit').hidden == false) {
        const getAddedRemoved = (one, two) => {
            let list = []
            for (let o of one) {
                let flag = false;
                for (let t of two) {
                    if (o == t) {
                        flag = true;
                        break;
                    }
                }
                if (flag == false) {
                    list.push(o);
                }
            }
            return list;
        };
        const added = getAddedRemoved(selected_userlist, initial_selected_userlist);
        const removed = getAddedRemoved(initial_selected_userlist, selected_userlist);
        $('#group-form-edit .group-input .btn.btn-primary').replaceWith(`<div class="group-participants"><p class="participants"><b>+${added.length}, -${removed.length}</b></p></div>`);
    }
}

function editUser(element) {
    $('[data-toggle="tooltip"]').tooltip("hide");
    if ($('#user-form-edit').length == 0) {
        const current_user = element.parentElement;
        const splitclass = current_user.className.split(" ");
        const current_name = $(`.${splitclass[0]}.${splitclass[1]} .user-personal .name`).html();
        const current_email = $(`.${splitclass[0]}.${splitclass[1]} .user-personal .email`).html();
        const current_position = $(`.${splitclass[0]}.${splitclass[1]} .user-position .position`).html();
        $('#user-form-new .user-input, #user-form-new hr').remove();
        const new_element = document.getElementById('user-form-new').cloneNode(true);
        new_element.id = "user-form-edit";
        new_element.action = "/usergroups/edituser";
        new_element.innerHTML += `<div class="user-input">
                                    <div class="user-icon"><ion-icon name="person-circle-sharp"></ion-icon></div>
                                        <div class="user-personal form-group">
                                            <input type="text" id="edit-name" class="name form-control" name="fullname" value="${current_name}" placeholder="Full Name" required>
                                            <input id="edit-email" type="email" class="email form-control" name="email" value="${current_email}" placeholder="Email" required>
                                        </div>
                                    <div class="user-position form-group"><input id="edit-position" type="text" class="position form-control" name="position" value="${current_position}" placeholder="Position" required></div>
                                    <div class="user-confirm-btn"><a class="options" href='#' onclick="submitEditUserForm();" data-toggle="tooltip" data-placement="top" title="Confirm"><ion-icon name="checkmark-outline"></ion-icon></a></div>
                                    <div class="user-cancel-btn"><a class="options" href="#" onclick="cancelEditUserForm(${splitclass[1]}, '${current_name}', '${current_email}', '${current_position}');" data-toggle="tooltip" data-placement="top" title="Cancel"><ion-icon name="close-outline"></ion-icon></a></div>
                                </div>`;
        new_element.hidden = false;
        document.getElementById('user-table').replaceChild(new_element, current_user);
        $('#edit-name').focus();
        $('.options').tooltip({ delay: { show: 200, hide: 0 } });
    }
    else {
        alert("You can make only one edit at a time.");
        $('#edit-name').focus();
    }
}

function editGroup(element) {
    $('[data-toggle="tooltip"]').tooltip("hide");
    if ($('#group-form-edit').length == 0) {
        const current_group = element.parentElement;
        const splitclass = current_group.className.split(" ");
        const current_usercount = $(`.${splitclass[0]}.${splitclass[1]} .group-user-count .user-count`).html();
        const current_groupname = $(`.${splitclass[0]}.${splitclass[1]} .group-name .name`).html();
        const current_participants = $(`.${splitclass[0]}.${splitclass[1]} .group-participants .participants`).html();
        $('#group-form-new .group-input, #group-form-new hr').remove();
        const new_element = document.getElementById('group-form-new').cloneNode(true);
        new_element.id = "group-form-edit";
        new_element.action = "/usergroups/editgroup";
        new_element.innerHTML += `<div class="group-input">
                                    <div class="group-icon i1"><ion-icon name="person-circle-sharp"></ion-icon></div>
                                    <div class="group-icon i2"><ion-icon name="person-circle-sharp"></ion-icon></div>
                                    <div class="group-icon i3"><ion-icon name="person-circle-sharp"></ion-icon></div>
                                    <div class="group-name form-group">
                                        <input type="text" id="edit-groupname" class="groupname form-control" name="groupname" value="${current_groupname}" placeholder="Group Name" required>
                                    </div>
                                    <button type="button" class="btn btn-primary" onclick="getUsersE(${splitclass[1]});">+/- Users</button>
                                    <div class="group-confirm-btn"><a class="options" href='#' onclick="submitEditGroupForm(${splitclass[1]});" data-toggle="tooltip" data-placement="top" title="Confirm"><ion-icon name="checkmark-outline"></ion-icon></a></div>
                                    <div class="group-cancel-btn"><a class="options" href="#" onclick="cancelEditGroupForm(${splitclass[1]},'${current_usercount}','${current_groupname}','${current_participants}');" data-toggle="tooltip" data-placement="top" title="Cancel"><ion-icon name="close-outline"></ion-icon></a></div>
                                </div>`;
        new_element.hidden = false;
        document.getElementById('group-table').replaceChild(new_element, current_group);
        $('#edit-groupname').focus();
        $('.options').tooltip({ delay: { show: 200, hide: 0 } });
    }
    else {
        alert("You can make only one edit at a time.");
        $('#edit-groupname').focus();
    }
}

function deleteUser(element) {
    $('[data-toggle="tooltip"]').tooltip("hide");
    const current_user = element.parentElement;
    const splitclass = current_user.className.split(" ");
    const current_email = $(`.${splitclass[0]}.${splitclass[1]} .user-personal .email`).html();
    const flag = confirm("You are about to delete a user permanently. Is that okay?");
    if (flag) {
        const new_element = document.getElementById('user-form-new').cloneNode(true);
        new_element.id = "user-form-delete";
        new_element.action = "/usergroups/deleteuser";
        new_element.innerHTML += `<input type="email" name="email" value="${current_email}"/>`;
        document.getElementById('user-table').appendChild(new_element);
        new_element.submit();
        new_element.remove();
    }
    else {
        alert("Some error occurred. Please try again.");
    }
}

function deleteGroup(element) {
    $('[data-toggle="tooltip"]').tooltip("hide");
    const current_user = element.parentElement;
    const splitclass = current_user.className.split(" ");
    const flag = confirm("You are about to delete a group permanently. All the users linked to the group will also be deleted. Is that okay?");
    if (flag) {
        const new_element = document.getElementById('group-form-new').cloneNode(true);
        new_element.id = "group-form-delete";
        new_element.action = "/usergroups/deletegroup";
        new_element.innerHTML += `<input type="text" name="gid" value="${splitclass[1]}"/>`;
        document.getElementById('user-table').appendChild(new_element);
        new_element.submit();
        new_element.remove();
    }
    else {
        alert("Some error occurred. Please try again.");
    }
}

function submitAddUserForm() {
    const name = $('#new-name').val();
    const email = $('#new-email').val();
    const position = $('#new-position').val();
    if (name != '' && email != '' && position != '') {
        const form = document.getElementById('user-form-new');
        form.submit();
        $('#user-form-new .user-input').remove();
        form.hidden = true;
    }
    else {
        $('[data-toggle="tooltip"]').tooltip("hide");
        alert("One or more fields are empty. Please fill them to confirm.");   
    }
}

async function submitAddGroupForm() {
    const form = document.getElementById('group-form-new');
    const element1 = document.createElement("input");
    const element2 = document.createElement("input");
    element1.name = "users";
    element1.value = selected_userlist;
    element1.hidden = true;
    element2.name = "totalusers";
    element2.value = selected_userlist.length;
    element2.hidden = true;
    form.appendChild(element1);
    form.appendChild(element2);
    form.submit();
    $('#group-form-new .group-input').remove();
    form.hidden = true;
}

function submitEditUserForm() {
    const name = $('#edit-name').val();
    const email = $('#edit-email').val();
    const position = $('#edit-position').val();
    if (name != '' && email != '' && position != '') {
        const form = document.getElementById('user-form-edit');
        form.submit();
        $('#user-form-edit').remove();
    }
    else {
        $('[data-toggle="tooltip"]').tooltip("hide");
        alert("One or more fields are empty. Please fill them to confirm.");   
    }
}

function submitEditGroupForm(gid) {
    const form = document.getElementById('group-form-edit');
    const element1 = document.createElement("input");
    const element2 = document.createElement("input");
    const element3 = document.createElement("input");
    const element4 = document.createElement("input");
    element1.name = "gid";
    element1.value = gid;
    element1.hidden = true;
    element2.name = "initialusers";
    element2.value = initial_selected_userlist;
    element2.hidden = true;
    element3.name = "selectedusers";
    element3.value = selected_userlist;
    element3.hidden = true;
    element4.name = "totalusers";
    element4.value = selected_userlist.length;
    element4.hidden = true;
    form.appendChild(element1);
    form.appendChild(element2);
    form.appendChild(element3);
    form.appendChild(element4);
    form.submit();
    $('#group-form-edit .group-input').remove();
    form.hidden = true;
}

function cancelAddUserForm() {
    $('[data-toggle="tooltip"]').tooltip("hide");
    $('#user-form-new .user-input, #user-form-new hr').remove();
    document.getElementById('user-form-new').hidden = true;
}

function cancelAddGroupForm() {
    $('[data-toggle="tooltip"]').tooltip("hide");
    $('#modal-users').empty();
    $('#all-chips').empty();
    $('#group-form-new .group-input, #group-form-new hr').remove();
    document.getElementById('group-form-new').hidden = true;
}

function cancelEditUserForm(id, name, email, position) {
    $('[data-toggle="tooltip"]').tooltip("hide");
    const current_element = document.getElementById('user-form-edit');
    const new_element = document.createElement('div');
    new_element.className = 'user ' + id;
    new_element.innerHTML = `<div class="user-icon"><ion-icon name="person-circle-sharp"></ion-icon></div>
                        <div class="user-personal">
                            <b class="name">${name}</b>
                            <i class="email">${email}</i>
                        </div>
                        <div class="user-position"><p class="position">${position}</p></div>
                        <div class="user-edit-btn"><a class="options" class="edit" href="#" onclick="editUser(this.parentElement);" data-toggle="tooltip" data-placement="top" title="Edit"><ion-icon name="pencil-outline"></ion-icon></a></div>
                        <div class="user-delete-btn"><a class="options" class="delete" href="#" onclick="deleteUser(this.parentElement);" data-toggle="tooltip" data-placement="top" title="Delete"><ion-icon name="trash-outline"></ion-icon></a></div>`;
    document.getElementById('user-table').replaceChild(new_element, current_element);
    $('.options').tooltip({ delay: { show: 200, hide: 0 } });
}

function cancelEditGroupForm(id, usercount, name, participants) {
    $('[data-toggle="tooltip"]').tooltip("hide");
    const current_element = document.getElementById('group-form-edit');
    const new_element = document.createElement('div');
    new_element.className = 'group ' + id;
    new_element.innerHTML = `<div class="group-icon i1"><ion-icon name="person-circle-sharp"></ion-icon></div>
                            <div class="group-icon i2"><ion-icon name="person-circle-sharp"></ion-icon></div>
                            <div class="group-icon i3"><ion-icon name="person-circle-sharp"></ion-icon></div>
                            <div class="group-user-count"><p class="user-count">${usercount}</p></div>
                            <div class="group-name">
                                <b class="name">${name}</b>
                            </div>
                            <div class="group-participants"><p class="participants">${participants}</p></div>
                            <div class="group-edit-btn"><a class="options" class="edit" href="#" onclick="editGroup(this.parentElement);" data-toggle="tooltip" data-placement="top" title="Edit"><ion-icon name="pencil-outline"></ion-icon></a></div>
                            <div class="group-delete-btn"><a class="options" class="delete" href="#" onclick="deleteGroup(this.parentElement);" data-toggle="tooltip" data-placement="top" title="Delete"><ion-icon name="trash-outline"></ion-icon></a></div>`;
    document.getElementById('group-table').replaceChild(new_element, current_element);
    $('#modal-users').empty();
    $('#all-chips').empty();
    $('.options').tooltip({ delay: { show: 200, hide: 0 } });
}
// Users & Groups (End) ============================================================================================================