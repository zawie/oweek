import React from 'react';
import './App.css';

import { Tree, TreeNode } from 'react-organizational-chart';
import { Card, Typography} from 'antd';
const { Title, Text } = Typography;
const { Meta } = Card;

function StudentCard(netId: String) {
    return  <Card
        hoverable
        style={{width: 128, margin: 5}}
        size="small"
        cover={<img
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />}>
        <Text strong> {netId} </Text>
        <br/>
        <Text type="secondary"> Brown</Text>
    </Card>
}

function CardGroup(netIds: String[]) {
    return <div style = {{display: "flex", justifyContent: "center", alignContent:"space-around"}}>
        {netIds.map((id: String) => StudentCard(id))}
    </div>
}

function App() {
  return (
    <div className="App">
        <Title> Brown Family Tree </Title>
        <Tree label={CardGroup(["Zawie","Daansih S", "John Smith"])}>
            <TreeNode label={CardGroup(["Anya Gu"])}/>
            <TreeNode label={CardGroup(["Bob Smith"])}>
                <TreeNode label={CardGroup(["Angela Lee"])}/>
                <TreeNode label={CardGroup(["Adrienne Zhang"])} />
            </TreeNode>
        </Tree>
    </div>
  );
}

export default App;
