import type { NextPage } from 'next'

import { SearchRequest, SearchResult } from './api/search'

import { useState } from "react";
import React from 'react';

import SearchBar from '../components/SearchBar';
import Landing from '../components/Landing';
import Loading from '../components/Loading';
import ContentDisplay from '../components/ContentDisplay';
import NoResults from '../components/NoResults';

const Home: NextPage = () => {

    const [searchResult, setSearchResult] = useState<SearchResult | undefined>(undefined);
    const [searching, setSearching] = useState<boolean>(false);
    const [showWheel, setShowWeel] = useState<boolean>(false);

    const doSearch = async (req: SearchRequest) => {
        const queries: string[] = Object.entries(req).map(
            ([k,v]: [string, any]) => `${k}=${v}`
        )
        
        const call = `/api/search${queries.length > 0 ? "?"+queries.join('&') : ""}`

        setSearching(true);
        setShowWeel(false);
        setTimeout(() => setShowWeel(true), 250);
        try {
            const res = await fetch(call);
            const data = await res.json();

            if (data.error != undefined) {
                console.log(data.error)
            }
            setSearchResult(() => data as SearchResult);
            setSearching(false);
        } catch (err) {
            console.log(err);
        }
    };

    const showLanding = searchResult == undefined 
    const noResults = searchResult == undefined || searchResult.homeFamilies.length + searchResult.parentFamilies.length == 0;

    return <div className="Content">
        {!showLanding && <div className='Top'>
            <SearchBar doSearch={doSearch} disabled={searching}/>
        </div>}
        {   
            searching ? <Loading visible={showWheel}/> :
            showLanding ? <Landing searching={searching} doSearch={doSearch}/> :
            noResults ? <NoResults searchedTerm={searchResult.focusName || ''}/> :
            <ContentDisplay searchResult={searchResult} doSearch={doSearch}/>
        }
    </div>;
}

export default Home
