import type { NextPage } from 'next'

import dynamic from "next/dynamic";
import { Scope } from "../components/FamilyTree"

import { SearchResult } from './api/search'
import { Family } from '../helper/family'

import  { Typography, Spin, Empty, Button, Divider} from 'antd';
import { useState } from "react";
import { LoadingOutlined, UserAddOutlined, SyncOutlined } from '@ant-design/icons';
import React from 'react';
import SearchBar from '../components/SearchBar';

const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />;
const { Text, Title } = Typography;

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
        setTimeout(() => setShowWeel(true), 250);
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

    const top = <div style={{
         width: "100vw",
         padding: 10,
         paddingLeft: 20,
         display: "flex",
         flexDirection: "column"
     }}>
         <SearchBar doSearch={doSearch} disabled={searching}/>
     </div>

    if (searching)
        return <>
            {top} 
            <div style={{height:"65vh", width:"100%", justifyContent:"center", alignItems:"center", display:"flex", flexDirection:"column"}}>
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
                <div style={{maxWidth: 1000, display:"flex", flexDirection:"column" }}>
                    <SearchBar doSearch={doSearch} disabled={searching}/>
                </div>
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
    searchResult.parentFamilies.forEach((family: Family) => {
        kids = kids.concat(family.kids);
    })

    if (siblings.length + parents.length + kids.length == 0) {
        return <div>
            {top}
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

    const hasKids = new Map<string, boolean>();
    const possibleParents = kids.concat(siblings);
    const possibleRelatedFamilies = searchResult.grandFamilies.concat(searchResult.newphewFamilies);
    for (const x of possibleParents) {
        hasKids.set(x, false);
        for (const f of possibleRelatedFamilies) {
            if (f.parents.includes(x)) {
                hasKids.set(x, true);
                break;
            }
        }
    }

    const scope: Scope = {
        kids: kids,
        siblings: siblings,
        parents: parents,
        focus: searchResult.focusName,
        hasKids,
    } as Scope;

    return <div style={{width:"100vw"}}>
        {top}

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
