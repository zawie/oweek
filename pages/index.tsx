import type { NextPage } from 'next'

import dynamic from "next/dynamic";
import { Scope } from "../components/FamilyTree"

import { SearchResult } from './api/getFamily'
import { Family } from '../helper/family'

import  { Input, Typography, Spin, Empty, Button, Card} from 'antd';
import { useState } from "react";
import { UserOutlined, LoadingOutlined, UserAddOutlined } from '@ant-design/icons';
import React from 'react';

const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />;
const { Text } = Typography;

const { Search } = Input

const Home: NextPage = () => {

    const [searchResult, setSearchResult] = useState<SearchResult | undefined>(undefined);
    const [searching, setSearching] = useState<boolean>(false);

    const FamTree = dynamic(
        () => import("../components/FamilyTree"),
        { ssr: false }
    );

    const doSearch = async (query: string) => {
        setSearching(true);
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
            setSearching(false);
        } catch (err) {
            console.log(err);
        }
    };

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
             <Text strong style={{fontSize: 32}}>
                {searchResult != undefined &&  searchResult.homeFamilies.map(f => f.name).join(", ")}
             </Text>
             <Text style={{fontSize: 24}}>
                 {searchResult != undefined && searchResult.homeFamilies.map(f => [f.college, "College", f.year].join(" ")).join(", ")}
             </Text>
         </>}
     </div>
     <div style={{ height: 90, minWidth:"100vw"}}/>
     </>

    if (searching)
        return <div>
            <div style={{height:"90vh", width:"100vw", justifyContent:"center", alignItems:"center", display:"flex", flexDirection:"column"}}>
                <Text type="secondary" > Loading... </Text>
                <br/>
                <Spin indicator={antIcon} size="large" />
            </div>
        </div>;

    if (searchResult == undefined)
            return <div>
            {getTop()}
            <div style={{width:"100vw", alignItems:"center", display:"flex", flexDirection:"column"}}>
                    
                <br/>
                <Card style={{minWidth: 750, margin:25, maxWidth:"90%"}}>
                    <Text strong style={{fontSize: 32}}> 
                        Welcome!
                    </Text>
                    <br/>
                    <br/>
                    <Text style={{fontSize: 16}}> 
                        Explore O-Week families at <a href="https://rice.edu">Rice University</a>. 
                        Start by <b>searching your name or your friends name above</b>!
                    </Text>
                    <br/>
                    <br/>
                    <Text style={{fontSize: 16}}> 
                        See any errors? Want to make a feature request? Email <a href="mailto:zawie@rice.edu"> Adam Zawierucha (zawie@rice.edu)</a>.
                    </Text> 
                    <br/>
                    <br/>
                    <Text style={{fontSize: 16}}> Be sure to add any O-Week families you were involved in or know of by filling out a form. 
                        The data will be automatically added!
                     </Text>
                    <div style={{display:"flex", justifyContent:"center"}}>
                        <Button type="link"
                        href="https://forms.gle/hUfXkadg8Z8L5Bt98"
                        size="large"
                        style={{
                            fontSize: 16,
                            minWidth: 128,
                        }}> <UserAddOutlined/> Add a Family </Button>
                    </div>
                </Card>
                <br/>
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

    if (siblings.length + parents.length + kids.length == 0) {
        return <div>
        {getTop()}
            <br/>
            <br/>
            <Empty
            description={
                <span>
                    Your search {'"'}{searchResult.focusName}{'"'} did not match any known students.
                </span>
            }>
                <Button type="link"
                    href="https://forms.gle/hUfXkadg8Z8L5Bt98"
                    size="large"
                    style={{
                        fontSize: 16,
                        minWidth: 128,
                }}> <UserAddOutlined/> Add a Family </Button>
            </Empty>
        </div>
    }
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
