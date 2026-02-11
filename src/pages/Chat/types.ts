export interface Message {
  id: number;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface MessageCreatedEvent {
  message: Message;
}
