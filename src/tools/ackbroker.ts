// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChannelEvent, MessageBroker } from "./messagebroker";

export interface AckEvent extends ChannelEvent {
  id: string;
  needsAck: boolean;
}

export interface AckSettings {
  retryAttempts: number;
  retryIntervalMS: number;
}
/**
 * A class wrapping broadcasting communication between widgets using intervals and retry attempts and Message Broker
 */
export class AckBroker {
  private broker: MessageBroker;
  private messages: Map<string, boolean>;
  private RETRY_ATTEMPTS: number;
  private RETRY_INTERVALMS: number;

  constructor(channelName?: string, settings?: AckSettings) {
    const defaultSettings: AckSettings = { retryAttempts: 3, retryIntervalMS: 1500 };
    const appliedSettings = settings ? { ...defaultSettings, ...settings } : defaultSettings;

    this.RETRY_ATTEMPTS = appliedSettings.retryAttempts;
    this.RETRY_INTERVALMS = appliedSettings.retryIntervalMS;

    this.broker = new MessageBroker(channelName);
    this.messages = new Map<string, boolean>();
  }
  private generateUniqueId(): string {
    return Math.random().toString(36).substring(7);
  }

  public received(event: AckEvent) {
    if (event.id && event.needsAck) {
      this.broker.publish(event);
    }
  }
  /**
   * Send Message with Acknowledgment
   * @param event
   */
  public send(event: ChannelEvent): Promise<any> {
    return new Promise<AckEvent | string>((resolve, reject) => {
      const uniqueId = this.generateUniqueId();
      const ackEvent = {
        ...event,
        sender: event.sender || this.broker.getChannelName(),
        id: uniqueId,
        needsAck: true,
      };
      this.messages.set(uniqueId, false);

      this.broker.publish(ackEvent);

      let retryCount = 0;
      const retryInterval = setInterval(() => {
        const isAcknowledged = this.messages.get(uniqueId);
        if (!isAcknowledged && retryCount < this.RETRY_ATTEMPTS) {
          retryCount++;
          this.broker.publish(ackEvent);
        } else {
          clearInterval(retryInterval);
          if (!isAcknowledged) {
            reject(new Error(`Failed to receive acknowledgement for message: ${uniqueId}`));
          }
        }
      }, this.RETRY_INTERVALMS);

      this.broker.subscribe(event.topic, (event: AckEvent) => {
        if (event.id == uniqueId && event.needsAck) {
          this.messages.set(uniqueId, true);
          resolve({ ...event, needsAck: false });
        }
      });
    });
  }

  /**
   * Close broker channel
   * @returns Promise<void>
   */
  public close(): Promise<void> {
    return this.broker.close();
  }
}
