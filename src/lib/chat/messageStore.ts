import { Message } from './types';

export class MessageStore {
  private messages: Message[] = [];

  addMessage(message: Message) {
    this.messages.push(message);
  }

  getMessages() {
    return [...this.messages];
  }

  clear() {
    this.messages = [];
  }
}