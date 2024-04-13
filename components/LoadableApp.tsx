import type { AppProps } from 'next/app'
import { Typography } from 'antd'
import { Analytics } from '@vercel/analytics/react';
import PageHeader from '../components/PageHeader';
import { GithubFilled } from '@ant-design/icons';
import Head from 'next/head';

const { Text } = Typography;

export const LoadableApp = ({ Component, pageProps }: AppProps) => {
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
        <meta 
            name="author" 
            content="Adam Zawierucha"
            key="auth"
        />
        <meta name="keywords" 
              content="O-Week, Oweek, Rice, Rice University, geneology, family tree"
        />
    </Head>
  
    <Analytics/>
    <PageHeader/>
    <Component {...pageProps} style={{width:"100%"}}/>
    <br/>
    <div className='Footer'>
        <Text type="secondary"> Made by <a href="https://www.zawie.io">Adam Zawierucha</a>.</Text>
        <Text type="secondary"> This is an open source project on <a href="https://github.com/zawie/oweek"> GitHub <GithubFilled/></a></Text>
    </div>
</div>
}