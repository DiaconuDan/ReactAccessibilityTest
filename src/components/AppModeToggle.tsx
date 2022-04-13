import React from "react";
import { useAppMode } from "../context/index";
import { AppMode} from "../context/types" ;
import { Switch } from "antd";
import  styled  from 'styled-components' ;

export const ToggleWrapper = styled.div`
    padding-bottom: 15px;
`;

const AppModeToggle: React.FunctionComponent = () => {
  const { appMode, setAppMode } = useAppMode();

  const isEnabled = appMode === AppMode.EDIT;

  const onToggle = (value: boolean) => {
    if (value) {
      setAppMode(AppMode.EDIT);
    } else {
      setAppMode(AppMode.READ);
    }
  };

  return (
    <ToggleWrapper>
      <label> App Mode:  </label>
      <Switch
        checkedChildren={AppMode.EDIT}
        unCheckedChildren={AppMode.READ}
        onChange={onToggle}
        defaultChecked={isEnabled}
        data-testid="appToggle"
      />
    </ToggleWrapper>
  );
};

export default AppModeToggle;
