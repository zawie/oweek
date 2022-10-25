import type { NextPage } from 'next'

import dynamic from "next/dynamic";
import { Scope } from "../components/FamilyTree"

import { Family, SearchResult } from './api/getFamily'

import  { Input, Typography } from 'antd';
import { UserOutlined} from "@ant-design/icons";
import { useState, useEffect} from "react";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />;
const { Text } = Typography;

const { Search } = Input

const Home: NextPage = () => {

    const [searchResult, setSearchResult] = useState<SearchResult | undefined>(undefined);

    const FamTree = dynamic(
        () => import("../components/FamilyTree"),
        { ssr: false }
    );

    const doSearch = async (query: string) => {
        setSearchResult(undefined)
        if (query == undefined) {
            console.log("empty query");
            return;
        }
        try {
            const res = await fetch(
                `/api/getFamily?query=${query}`
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

    const getTop = () => <> <div style={{
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
        {<>
             <Text strong style={{fontSize: 48}}>
                 {(searchResult == undefined || searchResult.homeFamilies.length == 0)? "Unknown Family" : searchResult.homeFamilies.map(f => f.name).join(", ")}
             </Text>
             <Text style={{fontSize: 24}}>
                 {searchResult != undefined && searchResult.homeFamilies.map(f => [f.college, "College", f.year].join(" ")).join(", ")}
             </Text>
         </>}
     </div>
     <div style={{ height: 90, minWidth:"100vw"}}/>
     </>

    if (searchResult == undefined)
        return <div>
            <div style={{height:"90vh", width:"100vw", justifyContent:"center", alignItems:"center", display:"flex", flexDirection:"column"}}>
                <Text type="secondary" > Loading... </Text>
                <br/>
                <Spin indicator={antIcon} size="large" />
            </div>
        </div>;

    let siblings: string[] = [];
    let parents: string[] = [];
    let kids: string[] = [];

    searchResult.homeFamilies.forEach((family: Family) => {
        siblings = siblings.concat(family.kids).filter(s=> s != searchResult.focusName);
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
        focus: searchResult.focusName,
    } as Scope;

    return <div>
        {getTop()}

        <div className="App">
            <FamTree scope={scope} doSearch={doSearch}/>
        </div>
    </div>;
}

export default Home
