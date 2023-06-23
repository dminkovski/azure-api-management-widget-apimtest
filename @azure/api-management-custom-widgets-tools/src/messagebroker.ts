// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { BroadcastChannel } from "broadcast-channel";

/**
 * The event in which widgets communicate with each other
 */
export interface ChannelEvent {
  topic: string;
  sender: string;
  message: string;
}
export interface PublishParams {
  topic: string;
  sender: string;
  senderOverride?: string;
  message: string;
}

/**
 * A class wrapping broadcasting communication between widgets.
 */
export class MessageBroker {
  private channel: BroadcastChannel;
  private subscriptions: Map<string, Set<(message: any) => void>>;
  private storedMessages: Map<string, ChannelEvent[]>;

  constructor(channelName?: string) {
    const name = channelName || "widget-message-channel";
    this.channel = new BroadcastChannel(name);
    this.subscriptions = new Map<string, Set<(message: any) => void>>();
    this.storedMessages = new Map<string, ChannelEvent[]>();

    this.channel.addEventListener("message", (event: ChannelEvent) => {
      this.handleIncomingMessage(event);
    });
  }

  private handleIncomingMessage(event: ChannelEvent) {
    if (!this.hasSubscribers(event)) {
      return;
    }
    this.storeMessage(event);
    this.messageSubscribers(event);
  }

  private hasSubscribers(event: ChannelEvent) {
    return this.subscriptions.has(event?.topic);
  }

  private storeMessage(event: ChannelEvent) {
    if (!this.storedMessages.has(event.topic)) {
      this.storedMessages.set(event.topic, [event]);
    } else {
      const storedMessages = this.storedMessages.get(event.topic)!;
      storedMessages.push(event);
    }
  }

  private messageSubscribers(event: ChannelEvent) {
    const topicSubscriptions = this.subscriptions.get(event.topic)!;
    const subscribers = Array.from(topicSubscriptions);
    subscribers.forEach((callback) => {
      if (event.sender !== this.getSenderName()) {
        callback(event);
      }
    });
  }
  private saveSubscriptionToTopic(topic: string) {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set<(event: ChannelEvent) => void>());
    }
  }

  private sendStoredMessages(topic: string, callback: (event: ChannelEvent) => void) {
    const storedMessages = this.storedMessages.get(topic)!;
    storedMessages.forEach((message) => {
      if (message.sender !== this.getSenderName()) {
        callback(message);
      }
    });
  }

  /**
   * Returns name of the broadcast channel
   * @returns string
   */
  public getChannelName(): string {
    return this.channel.name;
  }

  /**
   * Return the name of the current sender
   * @returns string
   */
  public getSenderName(): string {
    return `${window.location.pathname}`;
  }

  /**
   * Subscribe to a topic
   * @param topic
   * @param callback
   * @returns boolean
   */
  public subscribe(topic: string, callback: (event: ChannelEvent | any) => void): boolean {
    this.saveSubscriptionToTopic(topic);
    const topicSubscriptions = this.subscriptions.get(topic)!;

    if (!topicSubscriptions.has(callback)) {
      topicSubscriptions.add(callback);

      if (this.storedMessages.has(topic)) {
        this.sendStoredMessages(topic, callback);
      }

      return true;
    }
    return false;
  }

  /**
   * Publish a message to a topic
   * @param params
   */
  public publish(params: PublishParams | any): void {
    const { senderOverride } = params || { senderOverride: false };
    this.channel.postMessage({
      ...params,
      sender: senderOverride || this.getSenderName(),
    });
  }

  /**
   * Close channel
   * @returns Promise<void>
   */
  public close(): Promise<void> {
    return this.channel.close();
  }
}
