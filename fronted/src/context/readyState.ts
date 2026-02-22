// Shared ReadyState enum-like object for WebSocket connection status.
// Keeping this in a separate module helps Vite/React Fast Refresh keep
// consistent exports in React context modules.

export const ReadyState = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
    UNINSTANTIATED: -1,
} as const;

export type ReadyState = (typeof ReadyState)[keyof typeof ReadyState];
