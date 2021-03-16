const socket = io();

//Elements
const messageForm = document.querySelector('#message-form');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');
const sendLocation = document.querySelector('#send-location');
const messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    // New Message
    const newMessage = messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    //Visible Height
    const visibleHeight = messages.offsetHeight

    //Height of messages container
    const containerHeight = messages.scrollHeight

    //How far has the user scrolled
    const scrollOffset = messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight
    }
}


socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('MMM Do, h:m a') 
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (locationMessage) => {
    const html = Mustache.render(locationTemplate, {
        username: locationMessage.username,
        url: locationMessage.url,
        createdAt: moment(locationMessage.createdAt).format('MMM Do, h:m a') 
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    messageFormButton.setAttribute('disabled', 'disabled')
    const message = document.querySelector('input').value

    socket.emit('sendMessage', message, (error) => {
        
        messageFormButton.removeAttribute('disabled');
        messageFormInput.value = '';
        messageFormInput.focus();
        if(error) {
            return console.log(error)
        } 

        console.log('Message Delivered!')
    })
})

sendLocation.addEventListener('click', () => {
   
    if (navigator.geolocation) {
        sendLocation.setAttribute('disabled', 'disabled')
        navigator.geolocation.getCurrentPosition((position) => {
            let cordinates = {lat: position.coords.latitude, long: position.coords.longitude}
            socket.emit('sendLocation', cordinates, () => {
                sendLocation.removeAttribute('disabled')
            })
        });
    }else {
        return alert('Geolocation is not supported by your browser');
    }
})

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error);
        location.href = '/'
    }
})