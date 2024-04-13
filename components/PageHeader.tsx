import { Typography, Button } from 'antd';
const { Title } = Typography;
import { UserAddOutlined } from '@ant-design/icons';

type PageHeaderProps = {
}

export default function PageHeader(props: PageHeaderProps) {
    return <div className="PageHeader">
        <div style={{paddingTop:10}} >
            <Title style={{
                fontSize: 32,
            }}> <a style={{color:"black"}}href="https://oweek.zawie.io">🌳 oweek.zawie.io </a></Title>
        </div>
        <div style={{
            height:"100%",
            marginRight: 25
        }}>
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