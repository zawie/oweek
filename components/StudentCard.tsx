import { Card, Typography} from 'antd';
import Image from 'next/image'

const { Text } = Typography;

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
        cover={getOwl(student)}>
        <Text
            style={{fontSize: 10}}
        > {student} </Text>
    </Card>
}

function getOwl(student: string) {


    let src = `/assets/owls/owl${hash(student) % 30}.jpg`
    if (student.toLowerCase() == "adam zawierucha") {
        src = `/assets/owls/engineer.jpg`
    } else if (student.toLowerCase() == "anya gu") {
        src = `/assets/owls/queen.jpg`
    } else if (student.toLowerCase() == "daanish sheikh") {
        src = `/assets/owls/doctor.jpg`
    }
    return <Image
        src={src}
        alt="Owl (Woo! Woo!)"
        height="120"
        width="120"
    />
}