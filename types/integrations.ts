// types/integrations.ts
export type PluginId = "gmail" | "googlecalendar";

export interface ConnectResponse {
  authorizeUrl: string;
}

export interface StatusResponse {
  gmail:          { connected: boolean };
  googlecalendar: { connected: boolean };
}

export interface DisconnectResponse {
  success: boolean;
}