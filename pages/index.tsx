import type { NextPage } from 'next'
import { SearchResult } from './api/search'
import { useSearchParams } from 'next/navigation'

import { useState } from "react";
import React from 'react';

import SearchBar from '../components/SearchBar';
import Landing from '../components/Landing';
import Loading from '../components/Loading';
import ContentDisplay from '../components/ContentDisplay';
import NoResults from '../components/NoResults';

const Home: NextPage = () => {
    const searchParams = useSearchParams()

    const [searchResult, setSearchResult] = useState<SearchResult | undefined>(undefined);
    const [searching, setSearching] = useState<boolean>(false);
    const [showWheel, setShowWeel] = useState<boolean>(false);

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

    if (!searching && searchResult == undefined) {
        const query: string | null = searchParams.get('query')
        if (query != null) {
            doSearch(query)
        }
    }

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
