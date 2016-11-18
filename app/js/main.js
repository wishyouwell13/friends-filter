new Promise(function(resolve){
    if(document.readyState === 'complete'){
        resolve();
    }else{
        window.onload = resolve;
    }
}).then(function() {
    return new Promise(function(resolve, reject){
        //авторизация
        VK.init({
            apiId: 5588861
        });
        VK.Auth.login(function(response) {
            if (response.session) {
                resolve(response);
            } else {
                reject(new Error('Не удалось авторизоваться!'));
            }
        }, 2);
    });
}).then(function(){
    return new Promise(function(resolve, reject) {
        VK.api('friends.get', {v: '5.53', 'fields': 'photo_50'}, function (response) {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                Handlebars.registerHelper('tolowercase', function (str) {
                    return str.toLowerCase();
                });
                let friendsObj = [];
                for (let i = 0; i < response.response.items.length; i++) {
                    friendsObj[i] = {
                        first_name: response.response.items[i].first_name,
                        last_name: response.response.items[i].last_name,
                        photo_50: response.response.items[i].photo_50
                    };
                }
                //localStorage
                if (localStorage.friendsList) {
                    var localSaved = JSON.parse(localStorage.friendsList);
                    for (var elem in friendsObj) {
                        for (var locElem in localSaved) {
                            if (friendsObj[elem].first_name == localSaved[locElem].first_name && friendsObj[elem].last_name == localSaved[locElem].last_name && friendsObj[elem].photo_50 == localSaved[locElem].photo_50) {
                                friendsObj.splice(elem, 1);
                            }
                        }
                    };
                    //вывод друзей из localStorage
                    var _source = templateFriendsAdded.innerHTML;
                    var _templateFn = Handlebars.compile(_source);
                    var _template = _templateFn({ list: localSaved });
                    choosen_friends.innerHTML = _template;
                }
                //вывод друзей
                let content = document.getElementById('all_friends');
                let source = templateFriendsList.innerHTML;
                let templateFn = Handlebars.compile(source);
                let template = templateFn({ list: friendsObj });
                content.innerHTML = template;
                resolve();
            }
        });
    });
}).then(function() {
    let moveList = document.getElementsByClassName('.icon-add');
    let shareBack = document.getElementsByClassName('.icon-remove');
    all_friends.addEventListener('click', function(e){
        if(e.target.dataset.name == 'mark'){
            e.target.classList.remove('icon-add');
            e.target.classList.add('icon-remove');
            let elem = e.target.parentNode.parentNode;
            choosen_friends.appendChild(elem);
        }
    });
    choosen_friends.addEventListener('click', function(e){
        if(e.target.dataset.name == 'mark'){
            e.target.classList.add('icon-add');
            e.target.classList.remove('icon-remove');
            let elem = e.target.parentNode.parentNode;
            all_friends.appendChild(elem);
        }
    });
    //поиск в списке
    let styleAll = document.getElementById('all_friends_style');
    let styleAdded = document.getElementById('added_friends_style');

    searchAll.addEventListener('keyup', function () {
        var searchVal = this.value.toLowerCase();
        console.log(searchVal);
        styleAll.innerText = '#all_friends li:not([data-name*=' + searchVal + ']) {display:none;}';
    });

    searchListAdded.addEventListener('keyup', function () {
        var searchVal = this.value.toLowerCase();
        styleAdded.innerText = '#choosen_friends li:not([data-name*=' + searchVal + ']) {display:none;}';
    });
    //сохранение
    let listFriendsObj = [];
    saveFriends.addEventListener('click', function (e) {
        e.preventDefault();
        var allFriends = document.querySelector(".left-column").querySelectorAll('.f_item');
        var listFriends = document.querySelector(".right-column").querySelectorAll('.f_item');
        listFriends.forEach(function (elem, i) {
            var fullNameArr = elem.querySelector('.info_name').innerText;
            var full_name = fullNameArr.split(' ');
            listFriendsObj[i] = {
                first_name: full_name[0],
                last_name: full_name[1],
                photo_50: elem.querySelector('.img').getAttribute('src')
            };
        });
        localStorage.friendsList = JSON.stringify(listFriendsObj);
        console.log('Списки сохранены!');
    });
    resetButton.addEventListener('click', function(){
        localStorage.clear();
        location.reload();
    });
}).catch(function(e){
    console.log('Ошибка: ' + e.message);
    console.log('Сессия устарела, сделайте перезайдите в ВК !!!');
});
