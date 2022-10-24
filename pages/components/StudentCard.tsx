import { Card, Typography} from 'antd';

const { Text } = Typography;

const DEFAULT = "";

export function StudentCard(student: string, doSearch: any, focus: boolean = false) {
    return  <Card
        hoverable
        style={{
            width: 164,
            margin: 5,
            borderWidth: focus ? 7 : 0,
            borderColor: "gold"
        }}
        onClick={()=>doSearch(student)}
        size="small"
        cover={<img
            src={DEFAULT}
        />}>
        <Text strong > {student} </Text>
    </Card>
}