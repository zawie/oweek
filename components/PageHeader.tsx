import { Typography, Button } from 'antd';
const { Title } = Typography;
import { TrophyOutlined, UserAddOutlined } from '@ant-design/icons';

type PageHeaderProps = {
}

export default function PageHeader(props: PageHeaderProps) {
    return <div className="PageHeader">
        <div style={{paddingTop:10}} >
            <Title style={{
                fontSize: 32,
            }}> <a style={{color:"black"}}href="https://oweek.zawie.io">🌳 O-Week Index </a></Title>
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
                href="https://forms.gle/hUfXkadg8Z8L5Bt98"
                size="large"
                style={{
                    fontSize: 16,
                    minWidth: 128,
            }}> <UserAddOutlined/> Add a family </Button>
        </div>
    </div>
}