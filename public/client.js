const socket=io();
 var username;

 var chat = document.querySelector('.chats');
  var userList=document.querySelector('.user-list');
  var userCount=document.querySelector('.user-count');
 var user_msg=document.querySelector('#userMsg');
 var user_Btn=document.querySelector('#userBtn')

 var typeHere=document.querySelector(".typingHere");

 do{
     username=prompt("Enter your  name ?");
 }while(!username);
// join of user
 socket.emit("new-user-joined",username);


 // receve jo server n bheja hai name
//  notifying the user is joined
 socket.on('user-connected',(socket_name)=>{
     userJoinLeft(socket_name,'joined');

     
 });
 function userJoinLeft(name,status){
     let div=document.createElement("div");
     div.classList.add('userJoin');
     let content=`<p><b>${name}</b> ${status} the chat</p>`;
     div.innerHTML=content;
     chat.appendChild(div);
     chat.scrollTop=chat.scrollHeight;
 }
 // for disnonnection of user
 socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,'left');
 
});

//userlist for updating the user list and count
socket.on('user-list',(users)=>{
 // 1st set all content to black becoz ham chate hai jab bhi user conn ya disconn to tab user ka nay list ayy
     userList.innerHTML="";

     users_arr=Object.values(users);
     for( var i=0;i<users_arr.length;i++){
         let p= document.createElement('p');
         p.innerText=users_arr[i];
         userList.appendChild(p);

     }
     userCount.innerHTML=users_arr.length;
});
/* for sending the message */

user_Btn.addEventListener('click',()=>{
    
    let data={
        user:username,
        msg:user_msg.value
    };
    if(user_msg.value!=''){
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        user_msg.value='';
       
    }
   
});
function appendMessage(data,status){
    let div=document.createElement('div');
    div.classList.add('message',status);
    let content=`<h5>
           ${data.user}
           <p>${data.msg}</p>
    </h5>`;
    div.innerHTML=content; 
    chat.appendChild(div);
    chat.scrollTop=chat.scrollHeight;
}

// sending message to all 
socket.on('message',(data)=>{
    appendMessage(data,'incoming');
    typeHere.innerHTML="";
});
// for shwing how is typing here now
user_msg.addEventListener("keypress",function(){

let data={
    user:username,

};

 socket.emit("typing",data);
 

});
socket.on("typing",function(data){
 
     typeHere.innerHTML= data.user + " is typing...";
  
    
     
});
