import type { NextPage } from 'next'

import dynamic from "next/dynamic";
import { Scope } from "../components/FamilyTree"

import { SearchResult } from './api/getFamily'
import { Family } from '../helper/family'
import LoadingDelay from 'react-loading-delay';

import  { Input, Typography, Spin, Empty, Button, Card} from 'antd';
import { useState } from "react";
import { UserOutlined, LoadingOutlined, UserAddOutlined, SyncOutlined } from '@ant-design/icons';
import React from 'react';

const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />;
const { Text, Title } = Typography;

const { Search } = Input

const Home: NextPage = () => {

    const [searchResult, setSearchResult] = useState<SearchResult | undefined>(undefined);
    const [searching, setSearching] = useState<boolean>(false);

    const FamTree = dynamic(
        () => import("../components/FamilyTree"),
        { ssr: false }
    );

    const doSearch = async (query: string | undefined) => {
        setSearching(true);
        setSearchResult(undefined)
        try {
            const res = await fetch(
                query == undefined 
                    ? `api/getFamily`
                    : `/api/getFamily?query=${query}`
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
         <div style={{display:"flex", flexDirection:"row"}}>
            <Button
                onClick={() => doSearch(undefined)}
                size="large"
                type="primary"
                style={{
                    marginRight: 10,
                    fontSize: 16,
                    minWidth: 128,
            }}> <SyncOutlined />Random </Button>  
            <Search
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
        return <LoadingDelay check={searching} delay={2000}>
            {(isLoading: boolean, isDelaying: boolean) =>
                <div style={{height:"90vh", width:"100vw", justifyContent:"center", alignItems:"center", display:"flex", flexDirection:"column"}}>
                    {isLoading && isDelaying && <>
                        <Text type="secondary"> Loading... </Text>
                        <br/>
                        <Spin indicator={antIcon} size="large" />
                    </>}
                </div>
            }
        </LoadingDelay>;

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

    return <div>
        {getTop()}

        <div className="App">
            <FamTree scope={scope} doSearch={doSearch}/>
        </div>
    </div>;
}

export default Home
