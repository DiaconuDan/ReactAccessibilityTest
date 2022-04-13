import  { createContext, useContext } from "react";
import {AppModeContextInterface, AppMode } from './types' ;

export const AppModeInitialState = {
  appMode: AppMode.READ,
  setAppMode: () => {},
};

export const Context =
  createContext<AppModeContextInterface>(AppModeInitialState);

export const useAppMode = () => {
  const context = useContext(Context);
  const { appMode, setAppMode } = context;

  return {
    appMode,
    setAppMode,
  };
};
