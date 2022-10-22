import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import dynamic from "next/dynamic";

import styles from '../styles/Home.module.css'

import { demoFamily } from "./model/types.ts";

import  { PageHeader, Button, Typography } from 'antd';
import { UserAddOutlined} from "@ant-design/icons";

const Home: NextPage = () => {
    const FamilyTree = dynamic(
            () => import("./components/FamilyTree"), // replace '@components/map' with your component's location
            { loading: () => <div>Loading...</div>, ssr: false} // This line is important. It's what prevents server-side render
            );

    return(<>
            <PageHeader
                title="O-Week Family Tree"
                extra={[
                    <Button key="1" type="primary">
                        <UserAddOutlined /> Add Yourself!
                    </Button>
                ]}
            />
            <div className="App">
                <FamilyTree family={demoFamily}/>
            </div>
        </>
    );
}

export default Home
