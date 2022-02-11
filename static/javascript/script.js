var socket = io()
function chatNotify(name){
    var node = document.createElement('p');
    node.innerHTML=name+' joined the room'
    document.getElementById('messages').append(node);
}
function updateScroll(){
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
    console.log('jehuu')

}
function showMessage(text, username){
    var item = document.createElement('div')
    item.innerHTML = '<a href="#">'+username+'</a><p>' + text + '</p>'

    document.getElementById('messages').append(item);
    document.getElementById('message').value = '';
}

function showPeople(user){
        var item = document.createElement('button');
        item.innerHTML = user;
        item.style = "font-size: 1em"
        document.getElementById('online-users').append(item);
}

function sendText(text) {
    if(localStorage.getItem('username')){
        if(text){

            socket.emit('send_message',{
                name:localStorage.getItem('username'),
                message: text,
            })
         
        }
    }
    else{
        location.reload()
    }
}


function chatEnter() {


    $(document).keypress(
        function (event) {
            if (event.which == '13') {
                event.preventDefault();
                let message_input = document.getElementById('message');
                let message = message_input.value.trim();
                if(message != ''){
                    sendText(message_input.value);
                    
                    document.getElementById('message').value = '';
                }
            }
        });
}
function createName(name){
    localStorage.setItem('username',name);
    if(name.length > 10){
        alert('Choose a shorter name');
    }
    else{

        location.reload();
    }
}
function logout(){
    localStorage.removeItem('username');
    location.reload();

}
socket.on('disconnect_send',function(data){
    document.getElementById('online-users').innerHTML=''

    for(let i =0; i<data.length;i++){

        showPeople(data[i])
    }

});
socket.on('join_room_send',function(data){
   // console.log("Online users:",data.length);
    document.getElementById('online-users').innerHTML=''
    for(let i = 0;i<data.length;i++){
        showPeople(data[i])
    }
    updateScroll();
})
socket.on('join_room_send_notify',function(data){
    chatNotify(data);
 })
socket.on('send_message_send',function(data){
    showMessage(data.message,data.name);
    updateScroll()
})  
window.onload = function(){
    if(localStorage.getItem('username')){
        socket.emit('join_room',{
            name:localStorage.getItem('username'),
        })
        document.getElementById('myModal').style.display='none'
        document.getElementById('showloggedin').innerHTML = 'Logged in as: '+localStorage.getItem('username');
       // console.log(localStorage.getItem('username'))
    }

}
function joinenter(e){
    $(document).keypress(
        function(event){
          if (event.which == '13') {
                 event.preventDefault();
                 createName(document.getElementById('makename').value)
    
          }
      });

}