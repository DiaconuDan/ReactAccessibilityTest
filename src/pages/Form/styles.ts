import styled from "styled-components";
import { Button } from "antd";

export const ValidationError = styled.div`
  font-size: 11px;
  color: #e00028;
  margin-top: 10px;
`;

export const StyledButton = styled(Button)<{ color?: string }>`
  ${({ color }) => color && `background:${color};`}
  cursor: pointer;

`;



export const DateControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const GreyText = styled.span`
  font-size: 12px;
  color: #767676;
`;

export const Wrapper = styled.div`
  display: flex;
  align-content: left;
  align-items: left;
  padding: 20px;
 

  a:hover {
    text-decoration: none;
  }
`;

export const GreyP = styled.p`
  color: #616161;
`;

export const BoldP = styled.p`
  font-weight: 700;
  margin-bottom: 8px;
`;

export const DatesWrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 428px;
`;

export const DateSelectionContainer = styled.div`
  padding-bottom: 35px;

  .react-datepicker-wrapper {
    width: auto;
  }
`;
