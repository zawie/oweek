import { StudentCard } from "./StudentCard";
import { Student } from "../model/types";

import { Typography} from 'antd';
const { Text } = Typography;


export function StudentCardGroup(students: Student[], focus: boolean = false, sectionName?: String) {
    return <>
    {sectionName && <Text type="secondary"> {sectionName} </Text>}
    <div style = {{display: "flex", justifyContent: "center", alignContent:"space-around"}} >
        {students.map(s => StudentCard(s, focus))}
    </div>
    </>;
}
