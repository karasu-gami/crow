import type { IEvent } from "../typings/Event";

export abstract class Event implements IEvent {
  constructor(
    public name: keyof import("discord.js").ClientEvents,
    public once = false
  ) {}

  abstract execute(
    ...args: import("discord.js").ClientEvents[keyof import("discord.js").ClientEvents]
  ): Promise<void> | void;
}
