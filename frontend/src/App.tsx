import React from 'react';
import './App.css';

import { FamilyTree } from "./components/FamilyTree";
import { demoFamily } from "./model/types";

import  { PageHeader, Button, Typography } from 'antd';
import { UserAddOutlined} from "@ant-design/icons";


function App() {
  return <>
        <PageHeader
            title="O-Week Family Tree"
            extra={[
                <Button key="1" type="primary">
                    <UserAddOutlined /> Add Yourself!
                </Button>
            ]}
        />
        <div className="App">
            {FamilyTree(demoFamily)}
        </div>

  </>;
}

export default App;
