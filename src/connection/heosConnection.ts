import {
	HeosEventEmitter,
	HeosConnectionEventEmitter,
	HeosAllEventEmitter,
	HeosConnectionAllEventEmitter
} from '../listen/responseEventHandler'
import { generateHeosCommand } from '../write/heosCommand'
import { HeosCommandAttribute } from '../types'
import { Socket } from 'net'

/**
 * An object representing a connection with a HEOS device, and provides methods to communicate with the connected HEOS device.
 * @remark All the methods returns a HeosConnection which means that they are chainable.
 */
export class HeosConnection {
	constructor(
		on: HeosEventEmitter,
		once: HeosEventEmitter,
		onAll: HeosAllEventEmitter,
		socket: Socket
	) {
		this.on = (event, listener) => {
			if (this.closed) {
				console.warn('You are trying to add an event listener to a closed HeosConnection.')
			} else {
				on(event, listener)
			}
			return this
		}

		this.once = (event, listener) => {
			if (this.closed) {
				console.warn('You are trying to add an event listener to a closed HeosConnection.')
			} else {
				once(event, listener)
			}
			return this
		}

		this.onAll = listener => {
			if (this.closed) {
				console.warn('You are trying to add an event listener to a closed HeosConnection.')
			} else {
				onAll(listener)
			}
			return this
		}

		this.socket = socket
		this.socket.on('close', () => { this.closed = true })
	}

	private socket: Socket
	private closed: boolean = false

	/**
	 * Adds listener to events. When the event happens the listener will be triggered with the response.
	 * @param event The event to trigger the listener on.
	 * @param listener A callback function that will be triggered when the event happens.
	 * @returns A HeosConnection
	 */
	on: HeosConnectionEventEmitter

	/**
	 * Adds a **one-time** listener for an event. When the event happens the listener will be triggered with the response.
	 * @param event The event to trigger the listener on.
	 * @param listener A callback function that will be triggered when the event happens.
	 * @returns A HeosConnection
	 */
	once: HeosConnectionEventEmitter

	/**
	 * Adds listener to all events. When any event happens the listener will be triggered with the response.
	 * @param listener A callback function that will be triggered when the event happens.
	 * @returns A HeosConnection
	 */
	onAll: HeosConnectionAllEventEmitter

	/**
	 * Sends a command to the connected HEOS device. Check the [HEOS CLI Protocol Specification](http://rn.dmglobal.com/euheos/HEOS_CLI_ProtocolSpecification.pdf) to learn all the commands that can be sent.
	 * @param commandGroup The command group
	 * @param command The command to send
	 * @param attributes Optional attributes to include with the command
	 * @returns A HeosConnection
	 */
	write(
		commandGroup: string,
		command: string,
		attributes?: HeosCommandAttribute
	): HeosConnection {
		if (this.closed) {
			console.warn('You are trying to write to a closed HeosConnection.')
		} else {
			this.socket.write(generateHeosCommand(commandGroup, command, attributes))
		}
		return this
	}

	/**
	 * Closes the HeosConnection. It is still possible that the connected HEOS Device will send messages after calling this command.
	 * @returns A promise that resolves when the connection is finished. No messages will be sent from the HEOS Device after the promise is resolved.
	 */
	close(): Promise<void> {
		this.closed = true
		return new Promise(resolve => {
			this.socket.end('', undefined, resolve)
		})
	}
	
	/**
	 * Check if the connection is alive or closed
	 * @returns A boolean that indicates the connection status
	 */
	isAlive(): boolean {
		return !this.closed
	}
}
