import { Button, Input, Dropdown, Menu, Spin, Typography} from 'antd';
import { SyncOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons'
import { useState } from "react";
import { CompleteNameResult } from '../pages/api/completeName';

const { Text } = Typography;
const { Search } = Input;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

type SearchBarProps = {
    disabled:boolean
    doSearch: any
}

const minPartialLength = 1;

export default function SearchBar({ disabled, doSearch } : SearchBarProps) {

    const [optionsMap, setOptionsMap] = useState<Map<string,string[]>>(new Map<string,string[]>());
    const [currInput, setCurrInput] = useState<string>("");
    const [optionsReady, setOptionsReady] = useState<boolean>(false);

    const autoComplete = async (partial: string) => {
        setOptionsReady(false)
        if (partial == "" || optionsMap.has(partial) || partial.length <= minPartialLength) {
            setOptionsReady(true)
            return;
        }

        try {
            const res = await fetch(
               `/api/completeName?partial_name=${partial}`
            );
            const data = await res.json();

            console.log(data);
            setOptionsMap((map) => {
                map.set(partial, data.names);
                return map;
            });
            setOptionsReady(true)
        } catch (err) {
            console.log(err);
        }
    };

    const menu = optionsMap.has(currInput)
        ? <Menu
            onClick={(e) => doSearch(e.key)}
            items={
                optionsMap.get(currInput)?.map((name) => { 
                    return {
                        label: name.toLowerCase()
                            .split(' ')
                            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                            .join(' '), 
                        key: name
                    }
                })
            }
        />
        : <Menu>
                <Menu.Item>
                    <div style={{padding: 10}}>
                        <Spin indicator={antIcon} size="small" />
                        <Text type='secondary'> Loading... </Text>
                    </div>
                </Menu.Item>
         </Menu>

    const showSuggestions = !(currInput == "") && (!optionsReady || ((optionsMap).get(currInput) || []).length > 0);

    return  <div style={{display:"flex", flexDirection:"row"}}>
        <Button
            onClick={() => doSearch(undefined)}
            disabled={disabled}
            size="large"
            type="primary"
            style={{
                marginRight: 10,
                fontSize: 16,
                minWidth: 128,
            }}
        > 
            <SyncOutlined />Random 
        </Button>  
        <Dropdown overlay={menu} open={showSuggestions}>
            <Search
                disabled={disabled}
                size="large"
                placeholder="Search student name..."
                onSearch={(s)=> {
                    const str = s.toLowerCase();
                    console.log(str, optionsMap.has(str));
                    if (optionsMap.has(str)) {
                        doSearch((optionsMap.get(str) as string[])[0])
                    } else {
                        doSearch(s)
                    }
                }
            }
                onChange={(s)=> {
                    const input = s.currentTarget.value.toLowerCase();
                    autoComplete(input)
                    setCurrInput(input)
                }}
                style ={{
                    width:      "100%",
                    fontSize:   32
                }}
                prefix={<UserOutlined />}
            />
        </Dropdown>
    </div>
}
  
  