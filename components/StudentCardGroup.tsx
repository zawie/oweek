import { StudentCard } from "./StudentCard";

import { Typography} from 'antd';
import { SearchRequest } from "../pages/api/search";
const { Text } = Typography;


export function StudentCardGroup(students: string[], doSearch: (req: SearchRequest) => void, focus: boolean = false, sectionName?: String) {
    students.sort();
    return <>
    {sectionName && <Text type="secondary"> {sectionName} </Text>}
    <div style = {{display: "flex", justifyContent: "center", alignContent:"space-around"}} >
        {students.length > 0 ? students.map(s => StudentCard(s, doSearch, focus)) : <Text> Unknown 😔 </Text>}
    </div>
    </>;
}
