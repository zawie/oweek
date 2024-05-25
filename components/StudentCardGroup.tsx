import { StudentCard, CardType } from "./StudentCard";

import { Typography, Image} from 'antd';
const { Text } = Typography;

export enum Orientation {
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal",
} 

export function StudentCardGroup(
    students: string[], 
    doSearch: any, 
    focus: boolean = false, 
    sectionName: String | undefined = undefined, 
    college: string | undefined = undefined,
    orientation: Orientation = Orientation.HORIZONTAL, 
    cardType: CardType = CardType.MAJOR
) {
    students.sort();
    return <>
    {college &&   <Image
        src={`/assets/emblems/${college.toLowerCase()}.png`}
        alt="?"
        key={college}
        height={15}
        width={15}
    /> }
    {sectionName && <Text type="secondary"> {sectionName} </Text>}
    <div style = {{display: "flex", justifyContent: "center", alignContent:"space-around"}} >
        <div style = {{
            display: "flex", 
            justifyContent: orientation == Orientation.HORIZONTAL ? "center" : "space-around", 
            alignContent: orientation == Orientation.HORIZONTAL ? "space-around" : "center",
            flexDirection: orientation == Orientation.HORIZONTAL ? "row" : "column",
        }}>
            {students.length > 0 ? students.map(s => StudentCard(s, doSearch, focus, cardType)) : <Text> Unknown 😔 </Text>}
        </div>        
    </div>
    </>;
}
