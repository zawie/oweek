import { Typography, Button } from 'antd';
const { Title } = Typography;
import { TrophyOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import Link from 'next/link';

type PageHeaderProps = {
}

export default function PageHeader(props: PageHeaderProps) {
    return <div className="PageHeader">
        <div style={{paddingTop:10}} >
            <Title style={{
                fontSize: 32,
            }}> <Link passHref legacyBehavior href="/"><a style={{color: 'black'}}>🌳 oweek </a></Link></Title>
        </div>
        <div style={{
            height:"100%",
            marginRight: 25
        }}>
            <Button type='link'
                href='/leaderboard'
                size="large"
                style={{
                    fontSize: 16,
                    minWidth: 128,
            }}> <TrophyOutlined />Leaderboard </Button>
            <Button type="link"
                href="/create"
                size="large"
                style={{
                    fontSize: 16,
                    minWidth: 128,
            }}> <UsergroupAddOutlined/> Add Family </Button>
        </div>
    </div>
}