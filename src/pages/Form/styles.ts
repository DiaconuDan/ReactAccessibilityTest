import styled from "styled-components";
import { Button } from "antd";

export const ValidationError = styled.div`
  font-size: 11px;
  color: #e00028;
  margin-top: 10px;
`;

export const StyledButton = styled(Button)<{ color?: string }>`
  color: #D3D3D3;
  font-weight: 600;
  ${({ color }) => color && `background:${color};`}

  :hover {
    color: #D3D3D3;
    ${({ color }) => (color ? `background:${color};` : `background:green;`)}
  }
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
