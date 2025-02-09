import ActionProvider from "./ActionProvider";

class MessageParser {
  actionProvider: ActionProvider;

  constructor(actionProvider: ActionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message: string) {
    this.actionProvider.handleUserMessage(message);
  }
}

export default MessageParser;
