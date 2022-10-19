import { Student} from "../model/types";
import { Card, Typography} from 'antd';

const { Text } = Typography;

const DEFAULT = "https://www.personality-insights.com/wp-content/uploads/2017/12/default-profile-pic-e1513291410505.jpg";
export function StudentCard(student: Student) {
    return  <Card
        hoverable
        key={student.id}
        style={{width: 200, margin: 5}}
        size="small"
        cover={<img
            src={student.imageSrc || DEFAULT}
        />}>
        <Text strong> {student.name} </Text>
        <br/>
        {student.college && <Text type="secondary"> {student.college} </Text>}
    </Card>
}