import { Manager, Socket } from 'socket.io-client';

let socket: Socket;

export const connectToServer = (token: string) => {
    const manager = new Manager('localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            hola: 'mundo',
            authentication: token,
        }
    });

    socket?.removeAllListeners();
    socket = manager.socket('/');

    console.log({ socket });

    addListeners();
}

const addListeners = () => {
    const clientUl = document.querySelector('#clients-ul')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
    const serverStatusLabel = document.querySelector('#server-status')!;
    // TODO clients-ul

    /**
     *  Event de Socket.io
     * 
     *  on -> Es para escuchar eventos del servidor
     *  emit ->  Es para hablar con el servidor
     * 
     */

    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'Connected'
        console.log('Conectado')
    })

    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'Disconnected'
        console.log('Disconnect')
    })

    socket.on('client-update', (clients: string[]) => {
        console.log({ clients });

        let clientHTML = '';

        clients.forEach( clientId => {
            clientHTML += `
                <li> ${clientId} </li>
            `
        })

        clientUl.innerHTML = clientHTML;
    })

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (messageInput.value.trim().length <= 0) return;

        socket.emit('message-from-client', {
            id: 'YO!!',
            message: messageInput.value
        })

        messageInput.value = '';
    });

    socket.on('message-from-server', (payload: { fullName: string, message: string }) => {

        console.log('payload', payload);

        const newMessage = `
            <li>
                <strong>${payload.fullName}</strong>
                <span>${payload.message}</span>
            </li>
        `;

        const li = document.createElement('li');
        li.innerHTML = newMessage;

        messagesUl.append(li);
    });
}