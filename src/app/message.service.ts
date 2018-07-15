import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class MessageService {

    messages: Message[] = [];

    add(message: string) {
        this.messages.push(new Message(message));
    }

    clear(message: Message) {
        this.messages[this.messages.indexOf(message)] = null;
    }
}

class Message {
    static count = 0;

    id: number;
    text: string;

    constructor (mess: string) {
        this.id = Message.count++;
        this.text = mess;
    }
}
