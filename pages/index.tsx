import type { NextPage } from 'next'
import dynamic from "next/dynamic";

import { demoFamily } from "./model/types";

import  { PageHeader, Button } from 'antd';
import { UserAddOutlined} from "@ant-design/icons";
import { StudentFamily} from "./model/types";
import { useState} from "react";

const Home: NextPage = () => {

    const [family, setFamily]: [StudentFamily | undefined, any] = useState(undefined);


    const FamilyTree = dynamic(
        () => import("./components/FamilyTree"),
        { loading: () => <div>Loading...</div>, ssr: false}
    );


    const callAPI = async () => {
        try {
            const res = await fetch(
                `http://localhost:3000/api/getFamily`
                );
            const data = await res.json();
            console.log(data);
            setFamily(data);
        } catch (err) {
            console.log(err);
        }
    };
    
    if (family == undefined)
        return <div>Loading...

            <Button onClick={() => callAPI()}>
                Call API
            </Button>

    </div>;
    else
        return <>
            <PageHeader
                title="O-Week Family Tree"
                extra={[
                    <Button key="1" type="primary">
                        <UserAddOutlined /> Add Yourself!
                    </Button>
                ]}
            />
            <Button onClick={() => callAPI()}>
                Call API
            </Button>

            <div className="App">
                <FamilyTree family={family}/>
            </div>
        </>;
}

export default Home
