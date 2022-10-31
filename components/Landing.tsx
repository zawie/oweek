import { Button, Typography } from 'antd';
import SearchBar from './SearchBar';
const { Title } = Typography;
import { UserAddOutlined } from '@ant-design/icons';

type LandingProps = {
    doSearch: (query: string) => void,
    searching: boolean
}

export default function Landing(props: LandingProps) {
    const {doSearch, searching} = props;

    return <div>
    <div style={{width:"100vw", height: "65vh", alignItems:"center", justifyContent:"center", display:"flex", flexDirection:"column"}}>
        <Title type="secondary">
            Start Exploring
        </Title>  
        <div style={{
            width: "90vw",
            maxWidth: 1000,
            padding: 10,
            paddingLeft: 20,
            display: "flex",
            flexDirection: "column"
        }}>
            <SearchBar doSearch={doSearch} disabled={searching}/>
        </div>
        <br/>
        <div style={{display:"flex", justifyContent:"center"}}>
                <Button type="link"
                href="https://forms.gle/hUfXkadg8Z8L5Bt98"
                size="large"
                style={{
                    margin:5,
                    fontSize: 16,
                    minWidth: 128,
                }}> <UserAddOutlined/> Add a family </Button>
            </div>
    </div>
</div>
}