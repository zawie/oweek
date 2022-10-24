import { StudentCard } from "./StudentCard";
import { StudentRecord } from "../model/types";

import { Typography} from 'antd';
const { Text } = Typography;


export function StudentCardGroup(students: string[], doSearch: any, focus: boolean = false, sectionName?: String) {
    return <>
    {sectionName && <Text type="secondary"> {sectionName} </Text>}
    <div style = {{display: "flex", justifyContent: "center", alignContent:"space-around"}} >
        {students.map(s => StudentCard(s, doSearch, focus))}
    </div>
    </>;
}
