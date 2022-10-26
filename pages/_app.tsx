import 'antd/dist/antd.css';
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { Typography, Button} from 'antd'
import { UserAddOutlined } from "@ant-design/icons";
import { Analytics } from '@vercel/analytics/react';

const { Title, Text } = Typography;

function MyApp({ Component, pageProps }: AppProps) {
    return <div style={{backgroundColor: "whitesmoke", minHeight:"100vh"}}>
        <div style={{
            backgroundColor: "white",
            width: "100vw",
            paddingLeft: 16,
            display:"flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            <div style={{paddingTop:10 }}>
                <Title style={{
                    fontSize: 32,
                }}> 🌳 O-Week Genealogy </Title>
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
        <br/>
        <Component {...pageProps}/>
        <div  style={{
            width: "100vw",
            paddingTop: 32,
            paddingBottom: 32,
            display:"flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Text> Made with love by the best college, <a href="https://www.browncollege.org">Brown College</a>. BSWB! {"🚀"} </Text>
        </div>
        <Analytics />
  </div>
}

export default MyApp
