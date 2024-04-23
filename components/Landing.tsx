import { Button, Typography } from 'antd';
import SearchBar from './SearchBar';
import { useEffect, useState } from "react";
import { UsergroupAddOutlined } from '@ant-design/icons';
import { StatsResults } from '../pages/api/stats';

const { Title } = Typography;

type LandingProps = {
    doSearch: (query: string) => void,
    searching: boolean
}

export default function Landing(props: LandingProps) {
    const {doSearch, searching} = props;

    const [stats, setStats] = useState<StatsResults | undefined>(undefined); 
    
    useEffect(() => {
        fetch(`/api/stats`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.log(err))
    }, [])

    return <div>
    <div style={{width:"100vw", height: "65vh", alignItems:"center", justifyContent:"center", display:"flex", flexDirection:"column"}}>
        <Title type="secondary">
            {stats != undefined ? `Explore ${stats.num_students} Owls` : "Start Exploring"}
        </Title>  
        <div style={{
            width: "90vw",
            maxWidth: 1000,
            display: "flex",
            flexDirection: "column"
        }}>
            <SearchBar doSearch={doSearch} disabled={searching}/>
        </div>
        <br/>
        <div style={{display:"flex", justifyContent:"center"}}>
                <Button type="link"
                href="/create"
                size="large"
                style={{
                    margin:5,
                    fontSize: 16,
                    minWidth: 128,
                }}> <UsergroupAddOutlined/> Add Family </Button>
            </div>
    </div>
</div>
}