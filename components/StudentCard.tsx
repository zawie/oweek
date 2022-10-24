import { Card, Typography} from 'antd';
import Image from 'next/image'

import owl1 from "../assets/owl1.png"
import owl2 from "../assets/owl2.png"
import owl3 from "../assets/owl3.png"
import owl4 from "../assets/owl4.png"
import owl5 from "../assets/owl5.png"
import owl6 from "../assets/owl6.png"
import owl7 from "../assets/owl7.png"
import owl8 from "../assets/owl8.png"
import owl9 from "../assets/owl9.png"
import owl10 from "../assets/owl10.png"
import owl11 from "../assets/owl11.png"
import owl12 from "../assets/owl12.png"

const { Text } = Typography;

const owls = [owl1, owl2, owl3, owl4, owl5, owl6, owl7, owl8, owl9, owl10, owl11, owl12 ];

const hash =  (s: string):number  => {
    let h = 33;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charAt(i).charCodeAt(0);
    }
    return h;
};

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
        cover={<Image
            src={owls[hash(student) % owls.length]}
            alt="Owl (Woo! Woo!)"
            height="164"
            width="164"
        />}>
        <Text strong > {student} </Text>
    </Card>
}