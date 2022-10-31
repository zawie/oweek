import { Typography, Spin } from 'antd';
const { Text } = Typography;
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />;

type LoadingProps = {
    visible: boolean
}

export default function Loading(props: LoadingProps) {
    const {visible} = props;

    return <div style={{height:"65vh", width:"100%", justifyContent:"center", alignItems:"center", display:"flex", flexDirection:"column"}}>
        {visible && <>
            <Text type="secondary"> Loading... </Text>
            <br/>
            <Spin indicator={antIcon} size="large" />
        </>}
    </div>
}