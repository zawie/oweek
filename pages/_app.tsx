import 'antd/dist/antd.css';
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { Typography } from 'antd'
import { Analytics } from '@vercel/analytics/react';
import PageHeader from '../components/PageHeader';
import { GithubFilled } from '@ant-design/icons';
import Head from 'next/head';

const { Text } = Typography;

function MyApp({ Component, pageProps }: AppProps) {
    return <div className="App">
        <Head>
            <title>
                Rice O-Week Tree
            </title>
            <meta
            name="description"
            content="O-Week geneology site for Rice University orientation. Explore advisor and new student relationships in the Rice family tree!"
            key="desc"
            />
        </Head>
      
        <Analytics/>
        <PageHeader/>
        <Component {...pageProps} style={{width:"100%"}}/>
        <br/>
        <div className='Footer'>
            <Text type="secondary"> Made with love by the best college, <a href="https://www.browncollege.org">Brown College</a>.</Text>
            <Text type="secondary"> This is an open source project on <a href="https://github.com/zawie/oweek.org"> GitHub <GithubFilled/></a></Text>
        </div>
  </div>
}

export default MyApp
