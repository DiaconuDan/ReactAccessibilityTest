import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Form from "./pages/Form";
import Table from "./pages/Table/index";
import Navbar from "./components/Navbar";
import { QueryClient, QueryClientProvider } from "react-query";
import { AppModeProps} from './context/types' ;
import { Context,AppModeInitialState } from './context/index' ;

const queryClient = new QueryClient();



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
