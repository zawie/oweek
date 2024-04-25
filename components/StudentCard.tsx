import { Card, Typography} from 'antd';
import Image from 'next/image'
import { TopologyResult } from '../pages/api/topology';
import { useState } from 'react';
import md5 from 'md5';
import { normalize } from '../helper/name';

const { Text } = Typography;

const hash = function(str: string): number {
    return md5(str, {asBytes: true}).reduce((a, b) => a ^ b, 0)
}


export function StudentCard(student: string, doSearch: any, focus: boolean = false) {
    
    const [offspring, setOffspring] = useState(NaN)
    const [fetching, setFetching] = useState(false)
    if (!fetching && focus) {
        setFetching(true)
        getDescendants(student).then(setOffspring)
    }

    return  <Card
        hoverable
        type="inner"
        style={{
            width: focus ? 120 : 100,
            margin: 5,
            padding: 1,
            borderWidth: focus ? 3 : 0,
            backgroundColor: focus ? "lightyellow" : "white",
            borderColor: "gold"
        }}
        bodyStyle={{
            padding: 0,
            paddingBottom: 10
        }}
        onClick={()=>doSearch(student)}
        size="small"
        cover={getOwl(student)}>
        <Text
            style={{fontSize: 10}}
        > {student} </Text>
        {offspring > 0 && <>
            <br/>
            <Text
            style={{fontSize: 9, color: "gray"}}
            > {`Descendants: ${offspring}`} </Text>
        </>}
    </Card>
}

export function getOwl(student: string) {
    let src = `/assets/owls/owl${hash(normalize(student)) % 30}.jpg`
    if (student.toLowerCase() == "adam zawierucha") {
        src = `/assets/owls/engineer.jpg`
    } else if (student.toLowerCase() == "anya gu") {
        src = `/assets/owls/queen.jpg`
    } else if (student.toLowerCase() == "daanish sheikh") {
        src = `/assets/owls/president.jpg`
    } else if (student.toLowerCase() == "kevin huynh") {
        src = `/assets/owls/nyc.jpg`
    } else if (student.toLowerCase() == "kai hung") {
        src = `/assets/owls/science.jpg`
    }

    return <Image
        src={src}
        alt="Owl (Woo! Woo!)"
        height="120"
        width="120"
    />
}

async function getDescendants(student: string): Promise<number> {
    return fetch(`/api/topology?name=${student}`)
    .then(res => res.json())
    .then(data => (data as TopologyResult).descendantCount)
}