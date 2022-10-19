import React from 'react';
import './App.css';

import { Tree, TreeNode } from 'react-organizational-chart';
import { Card, Typography} from 'antd';
const { Title, Text } = Typography;
const { Meta } = Card;

function StudentCard(netId: String) {
    return  <Card
        hoverable
        style={{width: 100, margin: 5}}
        size="small"
        cover={<img
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />}>
        <Text strong> {netId} </Text>
        <br/>
        <Text type="secondary"> Brown</Text>
    </Card>
}

function CardGroup(netIds: String[], name?: String) {
    return <>
        {name && <Text type="secondary"> {name} </Text>}
        <div style = {{display: "flex", justifyContent: "center", alignContent:"space-around"}}>
            {netIds.map((id: String) => StudentCard(id))}
        </div>
    </>;

}

function App() {
  return (
    <div className="App">
        <Title> Brown Family Tree </Title>
        <Tree label={CardGroup(["Zawie","Daansih S", "John Smith", "Co-Advisor"], "Advisors")}>
            <TreeNode label={CardGroup(["Anya Gu"])}/>
            {["a","b","c"].map(s => <TreeNode label={CardGroup([s])}/> )}
            <TreeNode label={CardGroup(["Bob Smith"])}>
                {["a","b","c","a","b","c","a","b","c","a","b","c","a","b","c","a","b","c"].map(s => <TreeNode label={CardGroup([s])}/> )}
            </TreeNode>
            {["d","e","f", "g"].map(s => <TreeNode label={CardGroup([s])}/> )}
            <TreeNode label={CardGroup(["Bob Smith"])}>

            </TreeNode>
        </Tree>
    </div>
  );
}

export default App;
