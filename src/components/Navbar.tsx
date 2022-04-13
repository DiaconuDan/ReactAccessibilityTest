import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { FileTextOutlined, TableOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import "../index.css";


enum Pages {
  FORM = "FORM",
  TABLE = "TABLE",
}

const Navbar: React.FunctionComponent = () => {
  const [current, setCurrent] = useState(Pages.FORM);

  const handleClick = (e: any) => {
    setCurrent(e.key);
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Link to="/">
        <Menu.Item key={Pages.FORM} icon={<FileTextOutlined />}>
          Form
        </Menu.Item>
      </Link>
      <Link to="/table">
        <Menu.Item key={Pages.TABLE} icon={<TableOutlined />}>
          Table
        </Menu.Item>
      </Link>
    </Menu>
  );
};

export default Navbar;
