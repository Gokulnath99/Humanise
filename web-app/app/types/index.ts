// Humanise modes
export type HumaniseMode = "subtle" | "casual" | "executive";

export interface ModeConfig {
  key: HumaniseMode;
  label: string;
  description: string;
  icon: string;
}

// Em-dash handling
export type EmDashMode = "limit" | "remove" | "replace";

// Settings
export interface Settings {
  emDashMode: EmDashMode;
}

// API types
export interface HumaniseRequest {
  text: string;
  mode: HumaniseMode;
  emDashMode?: EmDashMode;
}

export interface HumaniseResponse {
  humanisedText: string;
}

export interface ApiError {
  error: string;
}
