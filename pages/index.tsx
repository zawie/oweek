import type { NextPage } from 'next'
import Head  from "next"

import dynamic from "next/dynamic";
import { Scope } from "./model/types";

import  { Input, Button, Typography } from 'antd';
import { UserOutlined} from "@ant-design/icons";
import { useState, useEffect} from "react";

const { Text } = Typography;

import { Family, SearchResult } from './api/getFamily'

const { Search } = Input

const Home: NextPage = () => {

    const [searchResult, setSearchResult] = useState<SearchResult | undefined>(undefined);

    const FamilyTree = dynamic(
        () => import("./components/FamilyTree"),
        { loading: () => <div>Loading...</div>, ssr: false}
    );

     const doSearch = async (query: string) => {
        if (query == undefined) {
            console.log("empty query");
            return;
        }
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
    
     useEffect(()=> {
         doSearch("Adam Zawierucha")
     }, [])
     const input = <> <div style={{
         position: "absolute",
         width: "100vw",
         minHeight: 32,
         padding: 10,
         paddingLeft: 20,
         display: "flex",
         flexDirection: "column"
     }}>
         <Search
            size="large"
            placeholder="Student Name..."
            onSearch={(s)=> doSearch(s)}
            style ={{
                width:      "100%",
                fontSize:   32
        }}
            prefix={<UserOutlined />}
        />
         <Text strong style={{fontSize: 48}}>
         </Text>
         <Text style={{fontSize: 32}}>
         </Text>
     </div>
     <div style={{ height: 90, minWidth:"100vw"}}/>
     </>

    if (searchResult == undefined)
        return <div>
            {input}
        </div>;

    console.log("Search result", searchResult);

    let siblings: string[] = [];
    let parents: string[] = [];
    let kids: string[] = [];

    searchResult.homeFamilies.forEach((family: Family) => {
        siblings = siblings.concat(family.kids).filter(s=> s != searchResult.name);
        parents = parents.concat(family.parents);
    })

    //TODO: Prompt if conflict, merging families for now...
    searchResult.advisingFamilies.forEach((family: Family) => {
        kids = kids.concat(family.kids);
    })

    const scope: Scope = {
        kids: kids,
        siblings:siblings,
        parents: parents,
        focus: searchResult.name,
    } as Scope;

    console.log("Scope", scope);

    return <div>
        {input}

        <div className="App">
            <FamilyTree scope={scope} doSearch={doSearch}/>
        </div>
    </div>;
}

export default Home
