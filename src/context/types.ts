export enum AppMode {
  EDIT = "EDIT",
  READ = "READ",
}

export interface AppModeContextInterface {
  appMode: AppMode;
  setAppMode(value: AppMode): void;
}

export interface AppModeProps {
  children: React.ReactNode;
}
