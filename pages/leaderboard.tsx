import type { NextPage } from 'next'



import { useEffect, useState } from "react";
import React from 'react';
import Image from 'next/image'

import Loading from '../components/Loading';
import { LeaderboardResult } from './api/leaderboard';

import { getOwl } from '../components/StudentCard';
import { Card, Typography } from 'antd';
const { Text, Title } = Typography;

const Leaderboard: NextPage = () => {

    const [result, setResult] = useState<LeaderboardResult | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [showWheel, setShowWeel] = useState<boolean>(true);

    const getLeaderboard = async(): Promise<void> => {
        setLoading(true);
        setResult(undefined);
        setShowWeel(false);
        setTimeout(() => setShowWeel(true), 250);
        try {
            const res = await fetch(`/api/leaderboard`);
            const data = await res.json() as LeaderboardResult;
            setResult(() => data);
            setLoading(false);
        } catch (err) {
            setShowWeel(false)
            setLoading(false)
            alert('☹️ Failed to generate leaderboard. Please try again later.')
            console.log(err);
        }
    };

    useEffect(() => {
        getLeaderboard()
    }, [])

    return <div className="Content">
         {loading && <Loading visible={showWheel}/>}
         {result != undefined && result.ranking.map(({student, descendentCount, college, year, firstInCollege}, i) => {
            const rank = i + 1;
            let medal = ''
            if (rank == 1) {
                medal = '🥇'
            } else if (rank == 2) {
                medal = '🥈'
            } else if (rank == 3) {
                medal = '🥉'
            } else if (firstInCollege) {
                medal = '🏅'
            }

            return <Card style={{margin: '15px'}} key={rank}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    {getOwl(student)}
                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '15px'}}>
                        <Title level={2}>{student} {medal}</Title>
                        <Text> 
                        {college != undefined && <>
                            <Image
                                src={`/assets/emblems/${college.toLowerCase()}.png`}
                                alt="?"
                                key={rank}
                                height="15"
                                width="15"
                            />
                            {' '}
                        </>}
                        {college || 'Unknown'} College - {year} </Text>
                        <Text>Rank: #{rank}</Text>
                        <Text> Descendants: {descendentCount} </Text>
                    </div>
                </div>

            </Card>
        })}
    </div>;
}

export default Leaderboard
