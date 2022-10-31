import 'antd/dist/antd.css';
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { Typography } from 'antd'
import { Analytics } from '@vercel/analytics/react';
import PageHeader from '../components/PageHeader';
import { GithubFilled } from '@ant-design/icons';

const { Text } = Typography;

function MyApp({ Component, pageProps }: AppProps) {
    return <div className="App">
        <Analytics/>
        <PageHeader/>
        <br/>
        <Component {...pageProps}/>
        <br/>
        <div className='Footer'>
            <Text> This is an open source project on <a href="https://github.com/zawie/oweek-genealogy"> GitHub <GithubFilled/></a></Text>
            <br/>
            <Text> Made with love by the best college, <a href="https://www.browncollege.org">Brown College</a>. BSWB! {"🚀"} </Text>
        </div>
  </div>
}

export default MyApp
