import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class MessageService {
    messages: Message[] = [];

    add(message: string) {
        this.messages.push({ text: message});
    }

    clear(message: Message) {
        this.messages[this.messages.indexOf(message)] = null;
    }
}

class Message {
    text: string;
}
