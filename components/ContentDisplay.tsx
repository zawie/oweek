import { Typography, Divider } from 'antd';
const { Text } = Typography;
import { LoadingOutlined } from '@ant-design/icons';
import { SearchResult } from '../pages/api/search';
import dynamic from 'next/dynamic';
import { Family } from '../helper/family';
import { Scope } from './FamilyTree';
const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />;

type ContentDisplayProps = {
    searchResult: SearchResult,
    doSearch: (query: string) => void
}

export default function ContentDisplay(props: ContentDisplayProps) {
    const { searchResult, doSearch } = props;

    const FamilyTree = dynamic(
        () => import("./FamilyTree"),
        { ssr: false }
    );

    let siblings: string[] = [];
    let parents: string[] = [];
    searchResult.homeFamilies.forEach((family: Family) => {
        siblings = siblings.concat(family.kids).filter(s=> s != searchResult.focusName);
        parents = parents.concat(family.parents);
    })

    let kids: string[] = [];
    searchResult.parentFamilies.forEach((family: Family) => {
        kids = kids.concat(family.kids);
    })
    
    let nephews: Map<string,string[]> = new Map<string, string[]>();
    siblings.forEach(s => nephews.set(s, []));
    searchResult.newphewFamilies.forEach((family: Family) => {
        siblings.forEach(sibling => {
            if (family.parents.includes(sibling)) {
                //@ts-ignore (Logically can't be undefined)
                nephews.set(sibling, nephews.get(sibling).concat(family.kids))
            }
        })
    })

    let grandkids: Map<string,string[]> = new Map<string, string[]>();
    kids.forEach(k => grandkids.set(k, []));
    searchResult.grandFamilies.forEach((family: Family) => {
        kids.forEach(kid => {
            if (family.parents.includes(kid)) {
                //@ts-ignore (Logically can't be undefined)
                grandkids.set(kid, grandkids.get(kid).concat(family.kids))
            }
        })
    })
    
    const scope: Scope = {
        kids, siblings, parents, nephews, grandkids,
        focus: searchResult.focusName,
    };

    return <div>
    <Divider style={{paddingLeft: 15, paddingRight: 15}}> 
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
    <FamilyTree scope={scope} doSearch={doSearch}/>
    <Divider style={{paddingLeft: 15, paddingRight: 15}} />
</div>
}