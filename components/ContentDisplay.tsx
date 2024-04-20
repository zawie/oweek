import { Typography, Divider } from 'antd';
const { Text } = Typography;
import { LoadingOutlined } from '@ant-design/icons';
import { SearchResult } from '../pages/api/search';
import dynamic from 'next/dynamic';
import { Family } from '../helper/family';
import { Scope } from './FamilyTree';
import Image from 'next/image'

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
    let kids: string[] = [];

    searchResult.homeFamilies.forEach((family: Family) => {
        siblings = siblings.concat(family.kids).filter(s=> s != searchResult.focusName);
        parents = parents.concat(family.parents);
    })

    //TODO: Prompt if conflict, merging families for now...
    searchResult.parentFamilies.forEach((family: Family) => {
        kids = kids.concat(family.kids);
    })
    
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
    };

    return <div>
    <Divider style={{paddingLeft: 15, paddingRight: 15}}> 
        <div style={{display:"flex", flexDirection:"column"}}>
            <Text strong style={{fontSize: 28}}>
                {searchResult.homeFamilies.map(f => f.name).join(", ")}
            </Text>
            <Text type="secondary" style={{fontSize: 20}}>
                {
                    searchResult.homeFamilies.map(f => 
                        <Image
                            src={`/assets/emblems/${f.college.toLowerCase()}.png`}
                            alt="?"
                            key={f.toString()}
                            height="17"
                            width="17"
                        />
                    )
                }
                {searchResult.homeFamilies.length > 0 
                    ? searchResult.homeFamilies.map(f => [" ", f.college, "College -", f.year].join(" ")).join(", ")
                    : "Unknown Family"
                    }
            </Text>
        </div>
    </Divider>
    <FamilyTree scope={scope} doSearch={doSearch}/>
    <Divider style={{paddingLeft: 15, paddingRight: 15}} />
</div>
}