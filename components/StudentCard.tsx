import { Card, Typography} from 'antd';
import Image from 'next/image'

import owl1 from "../assets/owls/owl1.jpg"
import owl2 from "../assets/owls/owl2.jpg"
import owl3 from "../assets/owls/owl3.jpg"
import owl4 from "../assets/owls/owl4.jpg"
import owl5 from "../assets/owls/owl5.jpg"
import owl6 from "../assets/owls/owl6.jpg"
import owl7 from "../assets/owls/owl7.jpg"
import owl8 from "../assets/owls/owl8.jpg"
import owl9 from "../assets/owls/owl9.jpg"
import owl10 from "../assets/owls/owl10.jpg"
import owl11 from "../assets/owls/owl11.jpg"
import owl12 from "../assets/owls/owl12.jpg"
import owl13 from "../assets/owls/owl13.jpg"
import owl14 from "../assets/owls/owl14.jpg"
import owl15 from "../assets/owls/owl15.jpg"
import owl16 from "../assets/owls/owl16.jpg"
import owl17 from "../assets/owls/owl17.jpg"
import owl18 from "../assets/owls/owl18.jpg"
import owl19 from "../assets/owls/owl19.jpg"
import owl20 from "../assets/owls/owl20.jpg"
import owl21 from "../assets/owls/owl21.jpg"
import owl22 from "../assets/owls/owl22.jpg"
import owl23 from "../assets/owls/owl23.jpg"
import owl24 from "../assets/owls/owl24.jpg"
import owl25 from "../assets/owls/owl25.jpg"

const { Text } = Typography;
const { Meta } = Card;

const owls = [owl1, owl2, owl3, owl4, owl5, owl6, owl7, owl8, owl9, owl10, owl11, owl12, owl13, owl14, owl15, owl16, owl17, owl18, owl19, owl20, owl21, owl22, owl23, owl24, owl25];

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