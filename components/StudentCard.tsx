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
import owl13 from "../assets/owl13.png"
import owl14 from "../assets/owl14.png"
import owl15 from "../assets/owl15.png"
import owl16 from "../assets/owl16.png"
import owl17 from "../assets/owl17.png"
import owl18 from "../assets/owl18.png"
import owl19 from "../assets/owl19.png"
import owl20 from "../assets/owl20.png"
import owl21 from "../assets/owl21.png"
import owl22 from "../assets/owl22.png"
import owl23 from "../assets/owl23.png"

const { Text } = Typography;
const { Meta } = Card;

const owls = [owl1, owl2, owl3, owl4, owl5, owl6, owl7, owl8, owl9, owl10, owl11, owl12, owl13, owl14, owl15, owl16, owl17, owl18, owl19, owl20, owl21, owl22, owl23];

const hash = function(str: string): number {
    let hash: number = 0;
    let i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash < 0 ? -hash : hash;
  }


export function StudentCard(student: string, doSearch: any, focus: boolean = false) {
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
        cover={<Image
            src={owls[hash(student) % owls.length]}
            alt="Owl (Woo! Woo!)"
            height="120"
            width="120"
        />}>
        <Text
            style={{fontSize: 10}}
        > {student} </Text>
    </Card>
}