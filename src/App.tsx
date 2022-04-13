import React, { createContext, useState, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Form from "./pages/Form";
import Table from "./pages/Table/index";
import Navbar from "./components/Navbar";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export enum AppMode {
  EDIT = "EDIT",
  READ = "READ",
}

interface AppModeContextInterface {
  appMode: AppMode;
  setAppMode(value: AppMode): void;
}

interface AppModeProps {
  children: React.ReactNode;
}

const AppModeInitialState = {
  appMode: AppMode.READ,
  setAppMode: () => {},
};

const Context = createContext<AppModeContextInterface>(AppModeInitialState);

export const AppModeContext = ({ children }: AppModeProps) => {
  const [appMode, setAppMode] = useState(AppModeInitialState.appMode);

  return (
    <Context.Provider
      value={{
        appMode,
        setAppMode,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppMode = () => {
  const context = useContext(Context);
  const { appMode, setAppMode } = context;

  return {
    appMode,
    setAppMode,
  };
};

const Application: React.FunctionComponent = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppModeContext>
          <Navbar />
          <Routes>
            <Route path="/" element={<Form />} />
            <Route path="table" element={<Table />} />
          </Routes>
        </AppModeContext>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default Application;
