var selected_userlist = [], users_dictlist, initial_selected_userlist = [];
var html_content;


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
                                <div class="user-confirm-btn"><a class="options" onclick="submitAddUserForm();" data-toggle="tooltip" data-placement="top" title="Confirm"><ion-icon name="checkmark-outline"></ion-icon></a></div>
                                <div class="user-cancel-btn"><a class="options" onclick="cancelAddUserForm();" data-toggle="tooltip" data-placement="top" title="Cancel"><ion-icon name="close-outline"></ion-icon></a></div>
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
                                <div class="group-confirm-btn"><a class="options" onclick="submitAddGroupForm();" data-toggle="tooltip" data-placement="top" title="Confirm"><ion-icon name="checkmark-outline"></ion-icon></a></div>
                                <div class="group-cancel-btn"><a class="options" onclick="cancelAddGroupForm();" data-toggle="tooltip" data-placement="top" title="Cancel"><ion-icon name="close-outline"></ion-icon></a></div>
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

async function editUser(element) {
    $('[data-toggle="tooltip"]').tooltip("hide");
    if ($('#user-form-edit').length == 0) {
        const current_user = element.parentElement;
        const uid = current_user.className.split(" ")[1];
        const response = await fetch(`/usergroups/userdetails/${parseInt(uid)}`);
        const json_response = await response.json();
        $('#user-form-new .user-input, #user-form-new hr').remove();
        const new_element = document.getElementById('user-form-new').cloneNode(true);
        new_element.id = "user-form-edit";
        new_element.action = "/usergroups/edituser";
        new_element.innerHTML += `<div class="user-input">
                                    <div class="user-icon"><ion-icon name="person-circle-sharp"></ion-icon></div>
                                        <div class="user-personal form-group">
                                            <input type="text" id="edit-name" class="name form-control" name="fullname" value="${json_response[0]}" placeholder="Full Name" required>
                                            <input id="edit-email" type="email" class="email form-control" name="email" value="${json_response[1]}" placeholder="Email" required>
                                        </div>
                                    <div class="user-position form-group"><input id="edit-position" type="text" class="position form-control" name="position" value="${json_response[2]}" placeholder="Position" required></div>
                                    <div class="user-confirm-btn"><a class="options" onclick="submitEditUserForm(${uid});" data-toggle="tooltip" data-placement="top" title="Confirm"><ion-icon name="checkmark-outline"></ion-icon></a></div>
                                    <div class="user-cancel-btn"><a class="options" onclick="cancelEditUserForm(${uid}, '${json_response[0]}', '${json_response[1]}', '${json_response[2]}');" data-toggle="tooltip" data-placement="top" title="Cancel"><ion-icon name="close-outline"></ion-icon></a></div>
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

async function editGroup(element) {
    $('[data-toggle="tooltip"]').tooltip("hide");
    if ($('#group-form-edit').length == 0) {
        const current_group = element.parentElement;
        const gid = current_group.className.split(" ")[1];
        const response = await fetch(`/usergroups/groupdetails/${parseInt(gid)}`);
        const json_response = await response.json();
        let usercount;
        if (json_response[1] > 3) {
            usercount = json_response[1] - 3;
        }
        else {
            usercount = 0;
        }
        $('#group-form-new .group-input, #group-form-new hr').remove();
        const new_element = document.getElementById('group-form-new').cloneNode(true);
        new_element.id = "group-form-edit";
        new_element.action = "/usergroups/editgroup";
        new_element.innerHTML += `<div class="group-input">
                                    <div class="group-icon i1"><ion-icon name="person-circle-sharp"></ion-icon></div>
                                    <div class="group-icon i2"><ion-icon name="person-circle-sharp"></ion-icon></div>
                                    <div class="group-icon i3"><ion-icon name="person-circle-sharp"></ion-icon></div>
                                    <div class="group-name form-group">
                                        <input type="text" id="edit-groupname" class="groupname form-control" name="groupname" value="${json_response[0]}" placeholder="Group Name" required>
                                    </div>
                                    <button type="button" class="btn btn-primary" onclick="getUsersE(${gid});">+/- Users</button>
                                    <div class="group-confirm-btn"><a class="options" onclick="submitEditGroupForm(${gid});" data-toggle="tooltip" data-placement="top" title="Confirm"><ion-icon name="checkmark-outline"></ion-icon></a></div>
                                    <div class="group-cancel-btn"><a class="options" onclick="cancelEditGroupForm(${gid},'${usercount}','${json_response[0]}','${json_response[1]}');" data-toggle="tooltip" data-placement="top" title="Cancel"><ion-icon name="close-outline"></ion-icon></a></div>
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

function submitAddGroupForm() {
    const groupname = $('#new-groupname').val();
    if (groupname != "" && selected_userlist.length > 0) {
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
    else if (groupname == "" && selected_userlist.length >= 0) {
        $('[data-toggle="tooltip"]').tooltip("hide");
        alert("One or more fields are empty. Please fill them to confirm.");
    }
    else {
        $('[data-toggle="tooltip"]').tooltip("hide");
        alert("No users have been added to this group. Please add users to confirm.");
    }
}

function submitEditUserForm(uid) {
    const name = $('#edit-name').val();
    const email = $('#edit-email').val();
    const position = $('#edit-position').val();
    if (name != '' && email != '' && position != '') {
        const form = document.getElementById('user-form-edit');
        const element1 = document.createElement("input");
        element1.name = "uid";
        element1.value = uid;
        element1.hidden = true;
        form.appendChild(element1);
        form.submit();
        $('#user-form-edit .user-input').remove();
        form.hidden = true;
    }
    else {
        $('[data-toggle="tooltip"]').tooltip("hide");
        alert("One or more fields are empty. Please fill them to confirm.");   
    }
}

function submitEditGroupForm(gid) {
    const groupname = $('#edit-groupname').val();
    if (groupname != "" && selected_userlist.length > 0) {
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
    else if (groupname == "" && selected_userlist.length >= 0) {
        $('[data-toggle="tooltip"]').tooltip("hide");
        alert("One or more fields are empty. Please fill them to confirm.");
    }
    else {
        $('[data-toggle="tooltip"]').tooltip("hide");
        alert("No users have been added to this group. Please add users to confirm.");   
    }
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
                        <div class="user-edit-btn"><a class="options" class="edit" onclick="editUser(this.parentElement);" data-toggle="tooltip" data-placement="top" title="Edit"><ion-icon name="pencil-outline"></ion-icon></a></div>
                        <div class="user-delete-btn"><a class="options" class="delete" onclick="deleteUser(this.parentElement);" data-toggle="tooltip" data-placement="top" title="Delete"><ion-icon name="trash-outline"></ion-icon></a></div>`;
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
                            <div class="group-edit-btn"><a class="options" class="edit" onclick="editGroup(this.parentElement);" data-toggle="tooltip" data-placement="top" title="Edit"><ion-icon name="pencil-outline"></ion-icon></a></div>
                            <div class="group-delete-btn"><a class="options" class="delete" onclick="deleteGroup(this.parentElement);" data-toggle="tooltip" data-placement="top" title="Delete"><ion-icon name="trash-outline"></ion-icon></a></div>`;
    document.getElementById('group-table').replaceChild(new_element, current_element);
    $('#modal-users').empty();
    $('#all-chips').empty();
    $('.options').tooltip({ delay: { show: 200, hide: 0 } });
}
// Users & Groups (End) ============================================================================================================



// Landing Pages (Start) ===========================================================================================================
function addPage() {
    if ($('#page-form-new .page-input').length == 0) {
        const form = document.getElementById('page-form-new');
        form.hidden = false;
        form.innerHTML += `<div class="page-input">
                                <div class="page-name form-group"><input type="text" id="new-name" class="name form-control" name="pagename" placeholder="Page Name" required/></div>
                                <button type="button" class="btn btn-primary" onclick="$('#add-content').modal()">Add HTML</button>
                                <div class="page-confirm-btn"><a class="options" onclick="submitAddPageForm();"><ion-icon name="checkmark-outline"></ion-icon>&nbsp;Confirm</a></div>
                                <div class="page-cancel-btn"><a class="options" onclick="cancelAddPageForm();"><ion-icon name="close-outline"></ion-icon>&nbsp;Cancel</a></div>
                            </div>`;
        $('.options').tooltip({ delay: { show: 200, hide: 0 } });
        $('#new-name').focus();
    }
    else {
        $('#new-name').focus();
    }
}

function savePageHTMLContent() {
    html_content = $('#modal-page-content-input').val();
    if (html_content != "") {
        $('#add-content').modal("hide");
        $('.pages-table .page-input .btn.btn-primary').replaceWith(`<div class="content-status"><p class="saved"><ion-icon name="bookmark-outline"></ion-icon> Saved</p></div>`);
    }
    else {
        alert("Please add HTML content for your page.");
    }
}

async function editPage(element) {
    $('[data-toggle="tooltip"]').tooltip("hide");
    if ($('#page-form-edit').length == 0) {
        const current_page = element.parentElement;
        const pid = current_page.className.split(" ")[1];
        const response = await fetch(`/landingpage/pagedetails/${parseInt(pid)}`);
        const json_response = await response.json();
        $('#page-form-new .page-input').remove();
        const new_element = document.getElementById('page-form-new').cloneNode(true);
        new_element.id = "page-form-edit";
        new_element.action = "/landingpage/editpage";
        new_element.innerHTML += `<div class="page-input">
                                    <div class="page-name form-group"><input type="text" id="edit-name" class="name form-control" name="pagename" value="${json_response[0]}" placeholder="Page Name" required/></div>
                                    <button type="button" class="btn btn-primary" onclick="$('#add-content').modal()">Add HTML</button>
                                    <div class="page-confirm-btn"><a class="options" onclick="submitEditPageForm(${pid});"><ion-icon name="checkmark-outline"></ion-icon>&nbsp;Confirm</a></div>
                                    <div class="page-cancel-btn"><a class="options" onclick="cancelEditPageForm(${pid}, '${json_response[0]}', '${json_response[1]}');"><ion-icon name="close-outline"></ion-icon>&nbsp;Cancel</a></div>
                                </div>`;
        new_element.hidden = false;
        document.getElementById('pages-table').replaceChild(new_element, current_page);
        $('#modal-page-content-input').val(json_response[2]);
        $('#edit-name').focus();
        $('.options').tooltip({ delay: { show: 200, hide: 0 } });
    }
    else {
        alert("You can make only one edit at a time.");
        $('#edit-name').focus();
    }
}

function deletePage(element) {
    $('[data-toggle="tooltip"]').tooltip("hide");
    const current_page = element.parentElement;
    const pid = current_page.className.split(" ")[1];
    const flag = confirm("You are about to delete a landing page permanently. Is that okay?");
    if (flag) {
        const form = document.getElementById('page-form-new').cloneNode(true);
        form.id = "page-form-delete";
        form.action = "/landingpage/deletepage";
        form.innerHTML += `<input type="text" name="pid" value="${pid}"/>`;
        document.getElementById('pages-table').appendChild(form);
        form.submit();
        form.remove();
    }
}

function submitAddPageForm() {
    const page_name = $('#new-name').val();
    if (page_name != "" && html_content != "") {
        const form = document.getElementById('page-form-new');
        const element = document.createElement("textarea");
        element.name = "content";
        element.value = html_content;
        element.hidden = true;
        form.appendChild(element);
        form.submit();
        $('#page-form-new .page-input').remove();
        form.hidden = true;
    }
    else {
        $('[data-toggle="tooltip"]').tooltip("hide");
        alert("One or more fields are empty. Please fill them to confirm.");   
    }
}

function submitEditPageForm(id) {
    const edited_name = $('#edit-name').val();
    if (edited_name != "" && html_content != "") {
        const form = document.getElementById('page-form-edit');
        const element1 = document.createElement("input");
        const element2 = document.createElement("textarea");
        element1.name = "pid";
        element1.value = id;
        element1.hidden = true;
        element2.name = "content";
        element2.value = html_content;
        element2.hidden = true;
        form.appendChild(element1);
        form.appendChild(element2);
        form.submit();
        $('#page-form-edit .page-input').remove();
        form.hidden = true;
    }
    else {
        $('[data-toggle="tooltip"]').tooltip("hide");
        alert("One or more fields are empty. Please fill them to confirm.");   
    }
}

function cancelAddPageForm() {
    $('[data-toggle="tooltip"]').tooltip("hide");
    $('#page-form-new .page-input').remove();
    document.getElementById('page-form-new').hidden = true;
}

function cancelEditPageForm(id, pagename, filename) {
    $('[data-toggle="tooltip"]').tooltip("hide");
    const current_element = document.getElementById('page-form-edit');
    const new_element = document.createElement('div');
    new_element.className = 'page ' + id;
    new_element.innerHTML = `<div class="page-name"><b class="name">${pagename}</b></div>
                            <div class="page-preview-btn"><a class="options" class="preview" target="_blank" href="/static/landingpages/${filename}.html" data-toggle="tooltip" data-placement="top" title="Preview"><ion-icon name="scan-outline"></ion-icon></a></div>
                            <div class="page-edit-btn"><a class="options" class="edit" onclick="editPage(this.parentElement);" data-toggle="tooltip" data-placement="top" title="Edit"><ion-icon name="pencil-outline"></ion-icon></a></div>
                            <div class="page-delete-btn"><a class="options" class="delete" onclick="deletePage(this.parentElement);" data-toggle="tooltip" data-placement="top" title="Delete"><ion-icon name="trash-outline"></ion-icon></a></div>
                            <div class="page-preview"><iframe class="preview" loading="lazy" src="/static/landingpages/${filename}.html"></iframe></div>`;
    document.getElementById('pages-table').replaceChild(new_element, current_element);
    $('#modal-page-content-input').val("");
    $('.options').tooltip({ delay: { show: 200, hide: 0 } });
}
// Landing Pages (End) =============================================================================================================



// Sending Profile (Start) =========================================================================================================
function addProfile() {
    if ($('#profile-form-new .profile-input').length == 0) {
        const form = document.getElementById('profile-form-new');
        form.hidden = false;
        form.innerHTML += `<div class="profile-input">
                                <div class="profile-details form-group">
                                    <input type="text" id="new-name" class="name form-control" name="profilename" placeholder="Profile name" required/>
                                    <input type="email" id="new-from" class="from form-control" name="profilefrom" placeholder="From" required/>
                                </div>
                                <div class="profile-interface form-group">
                                    <select id="new-interface" class="interface form-control" name="profileinterface">
                                        <option value="SMTP">SMTP</option>
                                    </select>
                                </div>
                                <button type="button" class="btn btn-primary" onclick="$('#profile-settings').modal()">+ Settings</button>
                                <div class="profile-confirm-btn"><a class="options" onclick="submitAddProfileForm();" data-toggle="tooltip" data-placement="top" title="Confirm"><ion-icon name="checkmark-outline"></ion-icon></a></div>
                                <div class="profile-cancel-btn"><a class="options" onclick="cancelAddProfileForm();" data-toggle="tooltip" data-placement="top" title="Cancel"><ion-icon name="close-outline"></ion-icon></a></div>
                            </div>`;
        $('.options').tooltip({ delay: { show: 200, hide: 0 } });
        $('#new-name').focus();
    }
    else {
        $('#new-name').focus();
    }
}

async function editProfile(element) {
    $('[data-toggle="tooltip"]').tooltip("hide");
    if ($('#profile-form-edit').length == 0) {
        const current_profile = element.parentElement;
        const pid = current_profile.className.split(" ")[1];
        const response = await fetch(`/sendingprofile/profiledetails/${parseInt(pid)}`);
        const json_response = await response.json();
        $('#profile-form-new .profile-input').remove();
        const new_element = document.getElementById('profile-form-new').cloneNode(true);
        new_element.id = "profile-form-edit";
        new_element.action = "/sendingprofile/editprofile";
        new_element.innerHTML += `<div class="profile-input">
                                    <div class="profile-details form-group">
                                        <input type="text" id="edit-name" class="name form-control" name="profilename" value="${json_response[0]}" placeholder="Profile name" required/>
                                        <input type="email" id="edit-from" class="from form-control" name="profilefrom" value="${json_response[1]}" placeholder="From" required/>
                                    </div>
                                    <div class="profile-interface form-group">
                                        <select id="edit-interface" class="interface form-control" name="profileinterface">
                                            <option value="SMTP">SMTP</option>
                                        </select>
                                    </div>
                                    <button type="button" class="btn btn-primary" onclick="$('#profile-settings').modal()">+ Settings</button>
                                    <div class="profile-confirm-btn"><a class="options" onclick="submitAddProfileForm(${pid});" data-toggle="tooltip" data-placement="top" title="Confirm"><ion-icon name="checkmark-outline"></ion-icon></a></div>
                                    <div class="profile-cancel-btn"><a class="options" onclick="cancelAddProfileForm(${pid}, '${json_response[0]}', '${json_response}');" data-toggle="tooltip" data-placement="top" title="Cancel"><ion-icon name="close-outline"></ion-icon></a></div>
                                </div>`;
        new_element.hidden = false;
        document.getElementById('profiles-table').replaceChild(new_element, current_profile);
        document.getElementById('new-host').id = "edit-host";
        document.getElementById('new-username').id = "edit-username";
        document.getElementById('new-password').id = "edit-password";
        $('#edit-host').val(json_response[2]);
        $('#edit-username').val(json_response[3]);
        $('#edit-password').val(json_response[4]);
        $('#edit-name').focus();
        $('.options').tooltip({ delay: { show: 200, hide: 0 } });
    }
    else {
        alert("You can make only one edit at a time.");
        $('#edit-name').focus();
    }
}

function submitAddProfileForm() {
    const profile_name = $('#new-name').val();
    const profile_from = $('#new-from').val();
    const profile_interface = $('#new-interface').val();
    const profile_host = $('#new-host').val();
    const profile_username = $('#new-username').val();
    const profile_password = $('#new-password').val();
    if (profile_name != "" && profile_from != "" && profile_interface != "" && profile_host != "" && profile_username != "" && profile_password != "") {
        const form = document.getElementById('profile-form-new');
        const element1 = document.createElement("input");
        const element2 = document.createElement("input");
        const element3 = document.createElement("input");
        element1.name = "profilehost";
        element1.value = profile_host;
        element1.hidden = true;
        element2.name = "profileusername";
        element2.value = profile_username;
        element2.hidden = true;
        element3.name = "profilepassword";
        element3.value = profile_password;
        element3.hidden = true;
        form.appendChild(element1);
        form.appendChild(element2);
        form.appendChild(element3);
        form.submit();
        $('#profile-form-new .profile-input').remove();
        form.hidden = true;
    }
    else {
        $('[data-toggle="tooltip"]').tooltip("hide");
        alert("One or more fields are empty. Please fill them to confirm.");   
    }
}

function cancelAddProfileForm() {
    $('[data-toggle="tooltip"]').tooltip("hide");
    $('#profile-form-new .profile-input').remove();
    document.getElementById('profile-form-new').hidden = true;
}
// Sending Profile (End) ===========================================================================================================



// Email Templates (Start) =========================================================================================================
function addTemplate() {
    if ($('#template-form-new .template-input').length == 0) {
        const form = document.getElementById('template-form-new');
        form.hidden = false;
        form.innerHTML += `<div class="template-input">
                                <div class="template-details form-group">
                                    <input type="text" id="new-name" class="name form-control" name="templatename" placeholder="Template name" required/>
                                    <input type="text" id="new-subject" class="subject form-control" name="templatesubject" placeholder="Subject" required/>
                                </div>
                                <button type="button" class="btn btn-primary" onclick="$('#add-content').modal()">Add HTML</button>
                                <div class="template-confirm-btn"><a class="options" onclick="submitAddTemplateForm();" data-toggle="tooltip" data-placement="top" title="Confirm"><ion-icon name="checkmark-outline"></ion-icon></a></div>
                                <div class="template-cancel-btn"><a class="options" onclick="cancelAddTemplateForm();" data-toggle="tooltip" data-placement="top" title="Cancel"><ion-icon name="close-outline"></ion-icon></a></div>
                            </div>`;
        $('.options').tooltip({ delay: { show: 200, hide: 0 } });
        $('#new-name').focus();
    }
    else {
        $('#new-name').focus();
    }
}

function saveTemplateHTMLContent() {
    html_content = $('#modal-template-content-input').val();
    console.log(html_content);
    if (html_content != "") {
        $('#add-content').modal("hide");
        $('.templates-table .template-input .btn.btn-primary').replaceWith(`<div class="content-status"><p class="saved"><ion-icon name="bookmark-outline"></ion-icon> Saved</p></div>`);
    }
    else {
        alert("Please add HTML content for your template.");
    }
}

function submitAddTemplateForm() {
    const template_name = $('#new-name').val();
    const template_subject = $('#new-subject').val();
    if (template_name != "" && template_subject != "" && html_content != "") {
        const form = document.getElementById('template-form-new');
        const element = document.createElement("textarea");
        element.name = "templatecontent";
        element.value = html_content;
        element.hidden = true;
        form.appendChild(element);
        form.submit();
        $('#template-form-new .template-input').remove();
        form.hidden = true;
    }
    else {
        $('[data-toggle="tooltip"]').tooltip("hide");
        alert("One or more fields are empty. Please fill them to confirm.");   
    }
}

function cancelAddTemplateForm() {
    $('[data-toggle="tooltip"]').tooltip("hide");
    $('#template-form-new .template-input').remove();
    document.getElementById('template-form-new').hidden = true;
}
// Email Templates (End) ===========================================================================================================



// Campaigns (Start) ===============================================================================================================
function runCampaign() {
    const campaign_name = $('#new-name').val();
    const email_template = $('#new-emailtemp').val();
    const landing_page = $('#new-landpage').val();
    const sending_profile = $('#new-sendprofile').val();
    const group = $('#new-group').val();
    if (campaign_name != "" && email_template != "" && landing_page != "" && sending_profile != "" && group != "") {
        const form = document.getElementById('campaign-form-new');
        const flag = confirm("The campaign is about to run with the applied configurations. Please confirm your action.");
        if (flag) {
            form.submit();
        }
    }
    else {
        $('[data-toggle="tooltip"]').tooltip("hide");
        alert("One or more fields are empty. Please fill them to confirm.");   
    }
}

async function completeCampaign(element) {
    $('[data-toggle="tooltip"]').tooltip("hide");
    const flag = confirm("You are about to mark this campaign as complete. All the processes will be stopped. Please confirm your action.");
    if (flag) {
        const current_running_campaign = element.parentElement;
        const cid = current_running_campaign.className.split(" ")[1];
        const form = document.getElementById('running-campaign-form');
        $('#running-campaign-form .rc-form-data').val(cid);
        form.action += "/complete";
        form.submit();
    }
}
// Campaigns (End) =================================================================================================================



// Dashboard (Start) ===============================================================================================================


// Dashboard (End) =================================================================================================================