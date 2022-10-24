import type { NextPage } from 'next'
import dynamic from "next/dynamic";

import { Scope } from "./model/types";

import  { PageHeader, Button } from 'antd';
import { UserAddOutlined} from "@ant-design/icons";
import { useState} from "react";

import { Family, SearchResult } from './api/getFamily'

const Home: NextPage = () => {

    const [searchResult, setSearchResult] = useState<SearchResult | undefined>(undefined);

    const FamilyTree = dynamic(
        () => import("./components/FamilyTree"),
        { loading: () => <div>Loading...</div>, ssr: false}
    );

    const query = "Bob Smith"
    const callAPI = async () => {
        try {
            const res = await fetch(
                `http://localhost:3000/api/getFamily?query=${query}`
                );
            const data = await res.json() as SearchResult;
            setSearchResult(() => data);
        } catch (err) {
            console.log(err);
        }
    };
    
    if (searchResult == undefined)
        return <div>Loading...

            <Button onClick={() => callAPI()}>
                Call API
            </Button>

        </div>;

    console.log("Search result", searchResult);

    let siblings: string[] = [];
    let parents: string[] = [];
    let kids: string[] = [];

    searchResult.homeFamilies.forEach((family: Family) => {
        siblings = siblings.concat(family.kids)
        parents = parents.concat(family.parents)
    })

    //TODO: Prompt if conflict, merging families for now...
    searchResult.advisingFamilies.forEach((family: Family) => {
        kids = kids.concat(family.kids);
    })

    const scope: Scope = {
        kids: kids,
        siblings:siblings,
        parents: parents,
        focus:query
    } as Scope;

    console.log("Scope", scope);

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
            <FamilyTree scope={scope}/>
        </div>
    </>;
}

export default Home
