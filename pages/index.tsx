import type { NextPage } from 'next'

import dynamic from "next/dynamic";
import { Scope } from "../components/FamilyTree"

import { SearchResult } from './api/search'
import { Family } from '../helper/family'

import  { Input, Typography, Spin, Empty, Button, Divider} from 'antd';
import { useState } from "react";
import { UserOutlined, LoadingOutlined, UserAddOutlined, SyncOutlined } from '@ant-design/icons';
import React from 'react';

const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />;
const { Text, Title } = Typography;

const { Search } = Input

const Home: NextPage = () => {

    const [searchResult, setSearchResult] = useState<SearchResult | undefined>(undefined);
    const [searching, setSearching] = useState<boolean>(false);
    const [showWheel, setShowWeel] = useState<boolean>(false);

    const FamTree = dynamic(
        () => import("../components/FamilyTree"),
        { ssr: false }
    );

    const doSearch = async (query: string | undefined) => {
        setSearching(true);
        setSearchResult(undefined);
        setShowWeel(false);
        setTimeout(()=>{setShowWeel(true); console.log("set show wheel to", searching)}, 250);
        try {
            const res = await fetch(
                query == undefined 
                    ? `/api/search`
                    : `/api/search?query=${query}`
            );
            const data = await res.json() as SearchResult;
            setSearchResult(() => data);
            setSearching(false);
        } catch (err) {
            console.log(err);
        }
    };

    const getTop = (disabled:boolean = false) => <div style={{
         width: "100vw",
         padding: 10,
         paddingLeft: 20,
         display: "flex",
         flexDirection: "column"
     }}>
         <div style={{display:"flex", flexDirection:"row"}}>
            <Button
                onClick={() => doSearch(undefined)}
                disabled={disabled}
                size="large"
                type="primary"
                style={{
                    marginRight: 10,
                    fontSize: 16,
                    minWidth: 128,
            }}> <SyncOutlined />Random </Button>  
            <Search
                disabled={disabled}
                size="large"
                placeholder="Search student name..."
                onSearch={(s)=> doSearch(s)}
                style ={{
                    width:      "100%",
                    fontSize:   32
            }}
                prefix={<UserOutlined />}
            />
        </div>
     </div>

    if (searching)
        return <>
            {getTop(true)} 
            <div style={{height:"65vh", width:"100vw", justifyContent:"center", alignItems:"center", display:"flex", flexDirection:"column"}}>
                {showWheel && <>
                    <Text type="secondary"> Loading... </Text>
                    <br/>
                    <Spin indicator={antIcon} size="large" />
                </>}
            </div>
        </>

    if (searchResult == undefined)
            return <div>
            <div style={{width:"100vw", height: "65vh", alignItems:"center", justifyContent:"center", display:"flex", flexDirection:"column"}}>
                <Title type="secondary">
                    Start Exploring
                </Title>  
                <Search
                    size="large"
                    enterButton="Search"
                    placeholder="Search student name..."
                    onSearch={(s)=> doSearch(s)}
                    style ={{
                        width:      "80%",
                        fontSize:   64
                }}
                    prefix={<UserOutlined />}
                />
                <br/>
                <div style={{display:"flex", justifyContent:"center"}}>
                        <Button type="link"
                        onClick={() => doSearch(undefined)}
                        size="large"
                        style={{
                            margin:5,
                            fontSize: 16,
                            minWidth: 128,
                        }}> <SyncOutlined /> Go to a random person </Button>
                        <Button type="link"
                        href="https://forms.gle/hUfXkadg8Z8L5Bt98"
                        size="large"
                        style={{
                            margin:5,
                            fontSize: 16,
                            minWidth: 128,
                        }}> <UserAddOutlined/> Add a family </Button>
                    </div>
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
                }}> <UserAddOutlined/> Add a family </Button>
            </Empty>
        </div>
    }
    const scope: Scope = {
        kids: kids,
        siblings:siblings,
        parents: parents,
        focus: searchResult.focusName,
    } as Scope;

    return <div style={{width:"100vw"}}>
        {getTop()}

        <div>
            <Divider style={{marginLeft: 15, marginRight: 15}}> 
                <div style={{display:"flex", flexDirection:"column"}}>
                    <Text strong style={{fontSize: 28}}>
                        {searchResult.homeFamilies.map(f => f.name).join(", ")}
                    </Text>
                    <Text type="secondary" style={{fontSize: 20}}>
                        {searchResult.homeFamilies.length > 0 
                            ? searchResult.homeFamilies.map(f => [f.college, "College -", f.year].join(" ")).join(", ")
                            : "Unknown Family"
                            }
                    </Text>
                </div>
            </Divider>
            <FamTree scope={scope} doSearch={doSearch}/>
            <Divider style={{marginLeft: 15, marginRight: 15}} />
        </div>
    </div>;
}

export default Home
